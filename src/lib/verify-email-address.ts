import net from "net";

const VERIFY_TIMEOUT_MS = 8_000;
const MAIL_FROM = "verify@truckrent.app";

/**
 * Large providers often block or obscure SMTP mailbox probes.
 * For these, we only reject when the domain has no MX records.
 */
const SMTP_UNRELIABLE_DOMAINS = new Set([
  "gmail.com",
  "googlemail.com",
  "google.com",
  "outlook.com",
  "hotmail.com",
  "live.com",
  "msn.com",
  "yahoo.com",
  "ymail.com",
  "icloud.com",
  "me.com",
  "mac.com",
  "proton.me",
  "protonmail.com",
  "aol.com",
]);

type VerifyResult =
  | { deliverable: true }
  | { deliverable: false; message: string };

type DnsAnswer = {
  type: number;
  data: string;
};

type DnsResponse = {
  Status: number;
  Answer?: DnsAnswer[];
};

type AbstractEmailResponse = {
  deliverability?: string;
  is_valid_format?: { value?: boolean };
  is_mx_found?: { value?: boolean };
  is_smtp_valid?: { value?: boolean };
};

function domainFromEmail(email: string): string | null {
  const domain = email.split("@")[1]?.trim().toLowerCase();
  return domain || null;
}

async function resolveMailHosts(domain: string): Promise<string[]> {
  const url = `https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=MX`;
  const res = await fetch(url, {
    headers: { Accept: "application/dns-json" },
    signal: AbortSignal.timeout(8_000),
  });

  if (!res.ok) {
    return [];
  }

  const payload = (await res.json()) as DnsResponse;
  if (payload.Status !== 0 || !payload.Answer?.length) {
    return [];
  }

  const hosts = payload.Answer.filter((record) => record.type === 15)
    .map((record) => {
      const parts = record.data.trim().split(/\s+/);
      const host = parts.at(-1) ?? record.data;
      return host.replace(/\.$/, "");
    })
    .filter(Boolean);

  return [...new Set(hosts)];
}

function readSmtpResponse(buffer: string): { code: number } | null {
  const lines = buffer.split(/\r?\n/).filter(Boolean);
  const last = lines.at(-1);
  if (!last || last.length < 4) return null;
  if (last[3] === "-") return null;
  const code = Number.parseInt(last.slice(0, 3), 10);
  return Number.isNaN(code) ? null : { code };
}

function smtpRcptCheck(
  host: string,
  email: string,
  timeoutMs: number
): Promise<"valid" | "invalid" | "unknown"> {
  return new Promise((resolve) => {
    const socket = net.connect({ host, port: 25, timeout: timeoutMs });
    let buffer = "";
    let stage: "greet" | "ehlo" | "mail" | "rcpt" | "done" = "greet";

    const finish = (result: "valid" | "invalid" | "unknown") => {
      if (stage !== "done") {
        stage = "done";
        clearTimeout(timer);
        socket.destroy();
        resolve(result);
      }
    };

    const timer = setTimeout(() => finish("unknown"), timeoutMs);

    const send = (command: string) => {
      socket.write(`${command}\r\n`);
    };

    socket.on("error", () => finish("unknown"));
    socket.on("timeout", () => finish("unknown"));

    socket.on("data", (chunk) => {
      buffer += chunk.toString();
      if (!buffer.includes("\n")) return;

      const response = readSmtpResponse(buffer);
      if (!response) return;
      const { code } = response;

      if (stage === "greet") {
        if (code >= 200 && code < 400) {
          stage = "ehlo";
          buffer = "";
          send(`EHLO ${MAIL_FROM.split("@")[1]}`);
        } else {
          finish("unknown");
        }
        return;
      }

      if (stage === "ehlo") {
        if (code >= 200 && code < 400) {
          stage = "mail";
          buffer = "";
          send(`MAIL FROM:<${MAIL_FROM}>`);
        } else {
          finish("unknown");
        }
        return;
      }

      if (stage === "mail") {
        if (code >= 200 && code < 400) {
          stage = "rcpt";
          buffer = "";
          send(`RCPT TO:<${email}>`);
        } else {
          finish("unknown");
        }
        return;
      }

      if (stage === "rcpt") {
        send("QUIT");
        if (code >= 200 && code < 300) {
          finish("valid");
        } else if (code >= 500 && code < 600) {
          finish("invalid");
        } else {
          finish("unknown");
        }
      }
    });
  });
}

async function probeMailbox(email: string): Promise<"valid" | "invalid" | "unknown"> {
  const domain = domainFromEmail(email);
  if (!domain) {
    return "invalid";
  }

  const hosts = await resolveMailHosts(domain);
  if (hosts.length === 0) {
    return "invalid";
  }

  for (const host of hosts.slice(0, 2)) {
    const result = await smtpRcptCheck(host, email, VERIFY_TIMEOUT_MS);
    if (result !== "unknown") {
      return result;
    }
  }

  return "unknown";
}

async function verifyWithAbstractApi(
  email: string
): Promise<VerifyResult | null> {
  const apiKey = process.env.ABSTRACT_EMAIL_API_KEY?.trim();
  if (!apiKey) {
    return null;
  }

  const url = new URL("https://emailvalidation.abstractapi.com/v1/");
  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("email", email);

  try {
    const res = await fetch(url.toString(), {
      signal: AbortSignal.timeout(10_000),
    });

    if (!res.ok) {
      return null;
    }

    const data = (await res.json()) as AbstractEmailResponse;
    const deliverability = data.deliverability?.toUpperCase();

    if (deliverability === "DELIVERABLE") {
      return { deliverable: true };
    }

    if (
      deliverability === "UNDELIVERABLE" ||
      data.is_smtp_valid?.value === false
    ) {
      return {
        deliverable: false,
        message:
          "This email address does not exist. Use a real email you can access.",
      };
    }

    if (data.is_valid_format?.value === false || data.is_mx_found?.value === false) {
      return {
        deliverable: false,
        message: "Please enter a valid email address.",
      };
    }

    return null;
  } catch {
    return null;
  }
}

export async function verifyEmailAddressExists(
  email: string
): Promise<VerifyResult> {
  const domain = domainFromEmail(email);
  if (!domain) {
    return {
      deliverable: false,
      message: "Please enter a valid email address.",
    };
  }

  const hosts = await resolveMailHosts(domain);
  if (hosts.length === 0) {
    return {
      deliverable: false,
      message: "This email domain does not exist. Use a real email address.",
    };
  }

  const apiResult = await verifyWithAbstractApi(email);
  if (apiResult) {
    return apiResult;
  }

  if (SMTP_UNRELIABLE_DOMAINS.has(domain)) {
    return { deliverable: true };
  }

  const probe = await probeMailbox(email);

  if (probe === "valid" || probe === "unknown") {
    return { deliverable: true };
  }

  return {
    deliverable: false,
    message:
      "This email address does not exist. Use a real email you can access.",
  };
}
