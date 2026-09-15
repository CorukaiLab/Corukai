async function readTokenFromStdin() {
  if (!process.argv.includes("--token-stdin")) return "";

  process.stdin.setEncoding("utf8");
  let input = "";
  for await (const chunk of process.stdin) input += chunk;
  return input.trim();
}

const token = process.env.MAILERLITE_API_TOKEN || await readTokenFromStdin();
const groupName = process.env.MAILERLITE_GROUP_NAME || "Carta de CoruKai";

if (!token) throw new Error("MAILERLITE_API_TOKEN is required");

const headers = {
  Authorization: `Bearer ${token}`,
  Accept: "application/json",
  "Content-Type": "application/json",
};

const listResponse = await fetch(
  `https://connect.mailerlite.com/api/groups?filter[name]=${encodeURIComponent(groupName)}`,
  { headers },
);

if (!listResponse.ok) {
  throw new Error(`MailerLite group lookup failed with HTTP ${listResponse.status}`);
}

const listPayload = await listResponse.json();
let group = listPayload.data?.find((item) => item.name === groupName);
let created = false;

if (!group) {
  const createResponse = await fetch("https://connect.mailerlite.com/api/groups", {
    method: "POST",
    headers,
    body: JSON.stringify({ name: groupName }),
  });

  if (!createResponse.ok) {
    throw new Error(`MailerLite group creation failed with HTTP ${createResponse.status}`);
  }

  const createPayload = await createResponse.json();
  group = createPayload.data;
  created = true;
}

console.log(JSON.stringify({
  connected: true,
  groupId: group.id,
  groupName: group.name,
  created,
}, null, 2));
