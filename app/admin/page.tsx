"use client";

import { useState } from "react";

export default function AdminDashboard() {
  // State for domain operations
  const [domain, setDomain] = useState("");
  const [domainAuth, setDomainAuth] = useState("");
  const [domainCreate, setDomainCreate] = useState({
    name: "",
    period: 1,
    registrant: "",
    admin: "",
    tech: "",
    authpw: "",
    nameservers: "",
  });
  const [domainUpdate, setDomainUpdate] = useState({
    name: "",
    addNS: "",
    remNS: "",
    newAuthPW: "",
  });
  const [domainRenew, setDomainRenew] = useState({
    name: "",
    curExpDate: "",
    period: 1,
  });
  const [domainTransfer, setDomainTransfer] = useState({
    name: "",
    op: "request",
    authpw: "",
  });
  const [domainResult, setDomainResult] = useState<any>(null);

  // State for contact operations
  const [contactId, setContactId] = useState("");
  const [contactAuth, setContactAuth] = useState("");
  const [contactCreate, setContactCreate] = useState({
    id: "",
    email: "",
    voice: "",
    authpw: "",
    name: "",
    org: "",
    street: "",
    city: "",
    pc: "",
    cc: "KE",
    sp: "",
  });
  const [contactUpdate, setContactUpdate] = useState({
    id: "",
    email: "",
    voice: "",
    city: "",
  });
  const [contactResult, setContactResult] = useState<any>(null);

  // State for host operations
  const [host, setHost] = useState("");
  const [hostCreate, setHostCreate] = useState({
    name: "",
    addrs: "",
  });
  const [hostUpdate, setHostUpdate] = useState({
    name: "",
    addAddrs: "",
    remAddrs: "",
    newName: "",
  });
  const [hostResult, setHostResult] = useState<any>(null);

  // API call helper
  const callApi = async (path: string, method: string, body?: any) => {
    try {
      const response = await fetch(`http://localhost:3000${path}`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: body && method !== "GET" ? JSON.stringify(body) : undefined,
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.message || "API request failed");
      }
      return data;
    } catch (error: any) {
      return { code: null, msg: error.message, data: null };
    }
  };

  // Render result helper
  const renderResult = (result: any) => {
    if (!result) return null;
    return (
      <div className="mt-4 p-4 bg-gray-100 rounded">
        <h3 className="font-medium">Result:</h3>
        <pre className="text-sm">{JSON.stringify(result, null, 2)}</pre>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Registrar Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Domains */}
        <div className="bg-white rounded shadow p-4">
          <h2 className="text-xl font-semibold mb-2">Domains</h2>
          {/* Check Domain */}
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setDomainResult(await callApi(`/domains/${encodeURIComponent(domain)}/check`, "GET"));
            }}
            className="mb-2"
          >
            <label className="block mb-1 font-medium">Check Domain</label>
            <input
              className="border p-1 rounded w-full mb-2"
              placeholder="example.co.ke"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              required
            />
            <button className="bg-blue-600 text-white px-3 py-1 rounded" type="submit">
              Check
            </button>
          </form>
          {/* Info Domain */}
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setDomainResult(await callApi(`/domains/${encodeURIComponent(domain)}/info?auth=${encodeURIComponent(domainAuth)}`, "GET"));
            }}
            className="mb-2"
          >
            <label className="block mb-1 font-medium">Info Domain</label>
            <input
              className="border p-1 rounded w-full mb-1"
              placeholder="example.co.ke"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              required
            />
            <input
              className="border p-1 rounded w-full mb-2"
              placeholder="Auth PW"
              value={domainAuth}
              onChange={(e) => setDomainAuth(e.target.value)}
              required
            />
            <button className="bg-blue-600 text-white px-3 py-1 rounded" type="submit">
              Info
            </button>
          </form>
          {/* Create Domain */}
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setDomainResult(
                await callApi("/domains", "POST", {
                  ...domainCreate,
                  nameservers: domainCreate.nameservers.split(",").map((ns) => ns.trim()).filter(Boolean),
                })
              );
            }}
            className="mb-2"
          >
            <label className="block mb-1 font-medium">Create Domain</label>
            <input
              className="border p-1 rounded w-full mb-1"
              placeholder="Domain Name"
              value={domainCreate.name}
              onChange={(e) => setDomainCreate((v) => ({ ...v, name: e.target.value }))}
              required
            />
            <input
              className="border p-1 rounded w-full mb-1"
              placeholder="Period"
              type="number"
              value={domainCreate.period}
              onChange={(e) => setDomainCreate((v) => ({ ...v, period: Number(e.target.value) }))}
              required
            />
            <input
              className="border p-1 rounded w-full mb-1"
              placeholder="Registrant"
              value={domainCreate.registrant}
              onChange={(e) => setDomainCreate((v) => ({ ...v, registrant: e.target.value }))}
              required
            />
            <input
              className="border p-1 rounded w-full mb-1"
              placeholder="Admin"
              value={domainCreate.admin}
              onChange={(e) => setDomainCreate((v) => ({ ...v, admin: e.target.value }))}
              required
            />
            <input
              className="border p-1 rounded w-full mb-1"
              placeholder="Tech"
              value={domainCreate.tech}
              onChange={(e) => setDomainCreate((v) => ({ ...v, tech: e.target.value }))}
              required
            />
            <input
              className="border p-1 rounded w-full mb-1"
              placeholder="Auth PW"
              value={domainCreate.authpw}
              onChange={(e) => setDomainCreate((v) => ({ ...v, authpw: e.target.value }))}
              required
            />
            <input
              className="border p-1 rounded w-full mb-2"
              placeholder="Nameservers (comma separated)"
              value={domainCreate.nameservers}
              onChange={(e) => setDomainCreate((v) => ({ ...v, nameservers: e.target.value }))}
            />
            <button className="bg-green-600 text-white px-3 py-1 rounded" type="submit">
              Create
            </button>
          </form>
          {/* Update Domain */}
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setDomainResult(
                await callApi(`/domains/${encodeURIComponent(domainUpdate.name)}`, "PATCH", {
                  addNS: domainUpdate.addNS.split(",").map((ns) => ns.trim()).filter(Boolean),
                  remNS: domainUpdate.remNS.split(",").map((ns) => ns.trim()).filter(Boolean),
                  newAuthPW: domainUpdate.newAuthPW || undefined,
                })
              );
            }}
            className="mb-2"
          >
            <label className="block mb-1 font-medium">Update Domain</label>
            <input
              className="border p-1 rounded w-full mb-1"
              placeholder="Domain Name"
              value={domainUpdate.name}
              onChange={(e) => setDomainUpdate((v) => ({ ...v, name: e.target.value }))}
              required
            />
            <input
              className="border p-1 rounded w-full mb-1"
              placeholder="Add NS (comma separated)"
              value={domainUpdate.addNS}
              onChange={(e) => setDomainUpdate((v) => ({ ...v, addNS: e.target.value }))}
            />
            <input
              className="border p-1 rounded w-full mb-1"
              placeholder="Remove NS (comma separated)"
              value={domainUpdate.remNS}
              onChange={(e) => setDomainUpdate((v) => ({ ...v, remNS: e.target.value }))}
            />
            <input
              className="border p-1 rounded w-full mb-2"
              placeholder="New Auth PW"
              value={domainUpdate.newAuthPW}
              onChange={(e) => setDomainUpdate((v) => ({ ...v, newAuthPW: e.target.value }))}
            />
            <button className="bg-yellow-600 text-white px-3 py-1 rounded" type="submit">
              Update
            </button>
          </form>
          {/* Delete Domain */}
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setDomainResult(await callApi(`/domains/${encodeURIComponent(domainUpdate.name)}`, "DELETE"));
            }}
            className="mb-2"
          >
            <label className="block mb-1 font-medium">Delete Domain</label>
            <input
              className="border p-1 rounded w-full mb-2"
              placeholder="Domain Name"
              value={domainUpdate.name}
              onChange={(e) => setDomainUpdate((v) => ({ ...v, name: e.target.value }))}
              required
            />
            <button className="bg-red-600 text-white px-3 py-1 rounded" type="submit">
              Delete
            </button>
          </form>
          {/* Renew Domain */}
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setDomainResult(
                await callApi(`/domains/${encodeURIComponent(domainRenew.name)}/renew`, "POST", {
                  curExpDate: domainRenew.curExpDate,
                  period: Number(domainRenew.period),
                })
              );
            }}
            className="mb-2"
          >
            <label className="block mb-1 font-medium">Renew Domain</label>
            <input
              className="border p-1 rounded w-full mb-1"
              placeholder="Domain Name"
              value={domainRenew.name}
              onChange={(e) => setDomainRenew((v) => ({ ...v, name: e.target.value }))}
              required
            />
            <input
              className="border p-1 rounded w-full mb-1"
              placeholder="Current Expiry Date (YYYY-MM-DD)"
              value={domainRenew.curExpDate}
              onChange={(e) => setDomainRenew((v) => ({ ...v, curExpDate: e.target.value }))}
              required
            />
            <input
              className="border p-1 rounded w-full mb-2"
              placeholder="Period"
              type="number"
              value={domainRenew.period}
              onChange={(e) => setDomainRenew((v) => ({ ...v, period: Number(e.target.value) }))}
              required
            />
            <button className="bg-green-700 text-white px-3 py-1 rounded" type="submit">
              Renew
            </button>
          </form>
          {/* Transfer Domain */}
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setDomainResult(
                await callApi(`/domains/${encodeURIComponent(domainTransfer.name)}/transfer`, "POST", {
                  op: domainTransfer.op,
                  authpw: domainTransfer.authpw,
                })
              );
            }}
            className="mb-2"
          >
            <label className="block mb-1 font-medium">Transfer Domain</label>
            <input
              className="border p-1 rounded w-full mb-1"
              placeholder="Domain Name"
              value={domainTransfer.name}
              onChange={(e) => setDomainTransfer((v) => ({ ...v, name: e.target.value }))}
              required
            />
            <input
              className="border p-1 rounded w-full mb-1"
              placeholder="Auth PW"
              value={domainTransfer.authpw}
              onChange={(e) => setDomainTransfer((v) => ({ ...v, authpw: e.target.value }))}
              required
            />
            <select
              className="border p-1 rounded w-full mb-2"
              value={domainTransfer.op}
              onChange={(e) => setDomainTransfer((v) => ({ ...v, op: e.target.value }))}
              required
            >
              <option value="request">Request</option>
              <option value="approve">Approve</option>
              <option value="reject">Reject</option>
              <option value="cancel">Cancel</option>
              <option value="query">Query</option>
            </select>
            <button className="bg-purple-700 text-white px-3 py-1 rounded" type="submit">
              Transfer
            </button>
          </form>
          {renderResult(domainResult)}
        </div>

        {/* Contacts */}
        <div className="bg-white rounded shadow p-4">
          <h2 className="text-xl font-semibold mb-2">Contacts</h2>
          {/* Check Contact */}
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setContactResult(await callApi(`/contacts/${encodeURIComponent(contactId)}/check`, "GET"));
            }}
            className="mb-2"
          >
            <label className="block mb-1 font-medium">Check Contact</label>
            <input
              className="border p-1 rounded w-full mb-2"
              placeholder="Contact ID"
              value={contactId}
              onChange={(e) => setContactId(e.target.value)}
              required
            />
            <button className="bg-blue-600 text-white px-3 py-1 rounded" type="submit">
              Check
            </button>
          </form>
          {/* Info Contact */}
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setContactResult(await callApi(`/contacts/${encodeURIComponent(contactId)}?auth=${encodeURIComponent(contactAuth)}`, "GET"));
            }}
            className="mb-2"
          >
            <label className="block mb-1 font-medium">Info Contact</label>
            <input
              className="border p-1 rounded w-full mb-1"
              placeholder="Contact ID"
              value={contactId}
              onChange={(e) => setContactId(e.target.value)}
              required
            />
            <input
              className="border p-1 rounded w-full mb-2"
              placeholder="Auth PW"
              value={contactAuth}
              onChange={(e) => setContactAuth(e.target.value)}
            />
            <button className="bg-blue-600 text-white px-3 py-1 rounded" type="submit">
              Info
            </button>
          </form>
          {/* Create Contact */}
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setContactResult(
                await callApi("/contacts", "POST", {
                  ...contactCreate,
                  street: contactCreate.street.split(",").map((s) => s.trim()).filter(Boolean),
                })
              );
            }}
            className="mb-2"
          >
            <label className="block mb-1 font-medium">Create Contact</label>
            <input
              className="border p-1 rounded w-full mb-1"
              placeholder="ID"
              value={contactCreate.id}
              onChange={(e) => setContactCreate((v) => ({ ...v, id: e.target.value }))}
              required
            />
            <input
              className="border p-1 rounded w-full mb-1"
              placeholder="Email"
              value={contactCreate.email}
              onChange={(e) => setContactCreate((v) => ({ ...v, email: e.target.value }))}
              required
            />
            <input
              className="border p-1 rounded w-full mb-1"
              placeholder="Voice"
              value={contactCreate.voice}
              onChange={(e) => setContactCreate((v) => ({ ...v, voice: e.target.value }))}
              required
            />
            <input
              className="border p-1 rounded w-full mb-1"
              placeholder="Auth PW"
              value={contactCreate.authpw}
              onChange={(e) => setContactCreate((v) => ({ ...v, authpw: e.target.value }))}
              required
            />
            <input
              className="border p-1 rounded w-full mb-1"
              placeholder="Name"
              value={contactCreate.name}
              onChange={(e) => setContactCreate((v) => ({ ...v, name: e.target.value }))}
              required
            />
            <input
              className="border p-1 rounded w-full mb-1"
              placeholder="Org"
              value={contactCreate.org}
              onChange={(e) => setContactCreate((v) => ({ ...v, org: e.target.value }))}
            />
            <input
              className="border p-1 rounded w-full mb-1"
              placeholder="Street (comma separated)"
              value={contactCreate.street}
              onChange={(e) => setContactCreate((v) => ({ ...v, street: e.target.value }))}
            />
            <input
              className="border p-1 rounded w-full mb-1"
              placeholder="City"
              value={contactCreate.city}
              onChange={(e) => setContactCreate((v) => ({ ...v, city: e.target.value }))}
              required
            />
            <input
              className="border p-1 rounded w-full mb-1"
              placeholder="PC"
              value={contactCreate.pc}
              onChange={(e) => setContactCreate((v) => ({ ...v, pc: e.target.value }))}
              required
            />
            <input
              className="border p-1 rounded w-full mb-1"
              placeholder="CC"
              value={contactCreate.cc}
              onChange={(e) => setContactCreate((v) => ({ ...v, cc: e.target.value }))}
              required
            />
            <input
              className="border p-1 rounded w-full mb-2"
              placeholder="SP"
              value={contactCreate.sp}
              onChange={(e) => setContactCreate((v) => ({ ...v, sp: e.target.value }))}
            />
            <button className="bg-green-600 text-white px-3 py-1 rounded" type="submit">
              Create
            </button>
          </form>
          {/* Update Contact */}
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setContactResult(
                await callApi(`/contacts/${encodeURIComponent(contactUpdate.id)}`, "PATCH", {
                  email: contactUpdate.email || undefined,
                  voice: contactUpdate.voice || undefined,
                  city: contactUpdate.city || undefined,
                })
              );
            }}
            className="mb-2"
          >
            <label className="block mb-1 font-medium">Update Contact</label>
            <input
              className="border p-1 rounded w-full mb-1"
              placeholder="Contact ID"
              value={contactUpdate.id}
              onChange={(e) => setContactUpdate((v) => ({ ...v, id: e.target.value }))}
              required
            />
            <input
              className="border p-1 rounded w-full mb-1"
              placeholder="Email"
              value={contactUpdate.email}
              onChange={(e) => setContactUpdate((v) => ({ ...v, email: e.target.value }))}
            />
            <input
              className="border p-1 rounded w-full mb-1"
              placeholder="Voice"
              value={contactUpdate.voice}
              onChange={(e) => setContactUpdate((v) => ({ ...v, voice: e.target.value }))}
            />
            <input
              className="border p-1 rounded w-full mb-2"
              placeholder="City"
              value={contactUpdate.city}
              onChange={(e) => setContactUpdate((v) => ({ ...v, city: e.target.value }))}
            />
            <button className="bg-yellow-600 text-white px-3 py-1 rounded" type="submit">
              Update
            </button>
          </form>
          {/* Delete Contact */}
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setContactResult(await callApi(`/contacts/${encodeURIComponent(contactUpdate.id)}`, "DELETE"));
            }}
            className="mb-2"
          >
            <label className="block mb-1 font-medium">Delete Contact</label>
            <input
              className="border p-1 rounded w-full mb-2"
              placeholder="Contact ID"
              value={contactUpdate.id}
              onChange={(e) => setContactUpdate((v) => ({ ...v, id: e.target.value }))}
              required
            />
            <button className="bg-red-600 text-white px-3 py-1 rounded" type="submit">
              Delete
            </button>
          </form>
          {renderResult(contactResult)}
        </div>

        {/* Hosts */}
        <div className="bg-white rounded shadow p-4">
          <h2 className="text-xl font-semibold mb-2">Hosts</h2>
          {/* Check Host */}
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setHostResult(await callApi(`/hosts/${encodeURIComponent(host)}/check`, "GET"));
            }}
            className="mb-2"
          >
            <label className="block mb-1 font-medium">Check Host</label>
            <input
              className="border p-1 rounded w-full mb-2"
              placeholder="Host Name"
              value={host}
              onChange={(e) => setHost(e.target.value)}
              required
            />
            <button className="bg-blue-600 text-white px-3 py-1 rounded" type="submit">
              Check
            </button>
          </form>
          {/* Info Host */}
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setHostResult(await callApi(`/hosts/${encodeURIComponent(host)}`, "GET"));
            }}
            className="mb-2"
          >
            <label className="block mb-1 font-medium">Info Host</label>
            <input
              className="border p-1 rounded w-full mb-2"
              placeholder="Host Name"
              value={host}
              onChange={(e) => setHost(e.target.value)}
              required
            />
            <button className="bg-blue-600 text-white px-3 py-1 rounded" type="submit">
              Info
            </button>
          </form>
          {/* Create Host */}
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setHostResult(
                await callApi("/hosts", "POST", {
                  name: hostCreate.name,
                  addrs: hostCreate.addrs
                    .split(",")
                    .map((ip) => ip.trim())
                    .filter(Boolean)
                    .map((ip) => ({
                      ipver: ip.includes(":") ? "v6" : "v4",
                      ip,
                    })),
                })
              );
            }}
            className="mb-2"
          >
            <label className="block mb-1 font-medium">Create Host</label>
            <input
              className="border p-1 rounded w-full mb-1"
              placeholder="Host Name"
              value={hostCreate.name}
              onChange={(e) => setHostCreate((v) => ({ ...v, name: e.target.value }))}
              required
            />
            <input
              className="border p-1 rounded w-full mb-2"
              placeholder="Addresses (comma separated)"
              value={hostCreate.addrs}
              onChange={(e) => setHostCreate((v) => ({ ...v, addrs: e.target.value }))}
            />
            <button className="bg-green-600 text-white px-3 py-1 rounded" type="submit">
              Create
            </button>
          </form>
          {/* Update Host */}
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setHostResult(
                await callApi(`/hosts/${encodeURIComponent(hostUpdate.name)}`, "PATCH", {
                  addAddrs: hostUpdate.addAddrs
                    .split(",")
                    .map((ip) => ip.trim())
                    .filter(Boolean)
                    .map((ip) => ({
                      ipver: ip.includes(":") ? "v6" : "v4",
                      ip,
                    })),
                  remAddrs: hostUpdate.remAddrs
                    .split(",")
                    .map((ip) => ip.trim())
                    .filter(Boolean)
                    .map((ip) => ({
                      ipver: ip.includes(":") ? "v6" : "v4",
                      ip,
                    })),
                  newName: hostUpdate.newName || undefined,
                })
              );
            }}
            className="mb-2"
          >
            <label className="block mb-1 font-medium">Update Host</label>
            <input
              className="border p-1 rounded w-full mb-1"
              placeholder="Host Name"
              value={hostUpdate.name}
              onChange={(e) => setHostUpdate((v) => ({ ...v, name: e.target.value }))}
              required
            />
            <input
              className="border p-1 rounded w-full mb-1"
              placeholder="Add Addresses (comma separated)"
              value={hostUpdate.addAddrs}
              onChange={(e) => setHostUpdate((v) => ({ ...v, addAddrs: e.target.value }))}
            />
            <input
              className="border p-1 rounded w-full mb-1"
              placeholder="Remove Addresses (comma separated)"
              value={hostUpdate.remAddrs}
              onChange={(e) => setHostUpdate((v) => ({ ...v, remAddrs: e.target.value }))}
            />
            <input
              className="border p-1 rounded w-full mb-2"
              placeholder="New Name"
              value={hostUpdate.newName}
              onChange={(e) => setHostUpdate((v) => ({ ...v, newName: e.target.value }))}
            />
            <button className="bg-yellow-600 text-white px-3 py-1 rounded" type="submit">
              Update
            </button>
          </form>
          {/* Delete Host */}
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setHostResult(await callApi(`/hosts/${encodeURIComponent(hostUpdate.newName || hostUpdate.name)}`, "DELETE"));
            }}
            className="mb-2"
          >
            <label className="block mb-1 font-medium">Delete Host</label>
            <input
              className="border p-1 rounded w-full mb-2"
              placeholder="Host Name"
              value={hostUpdate.newName || hostUpdate.name}
              onChange={(e) => setHostUpdate((v) => ({ ...v, newName: e.target.value }))}
              required
            />
            <button className="bg-red-600 text-white px-3 py-1 rounded" type="submit">
              Delete
            </button>
          </form>
          {renderResult(hostResult)}
        </div>
      </div>
    </div>
  );
}