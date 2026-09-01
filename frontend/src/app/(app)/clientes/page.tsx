"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { ApiError } from "@/lib/api";
import { createClient, deleteClient, fetchClients, updateClient } from "@/lib/resources";
import type { Client } from "@/lib/types";

const emptyForm = { name: "", phone: "", email: "", notes: "" };

export default function ClientesPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Client | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  function load(searchTerm?: string) {
    setLoading(true);
    fetchClients(searchTerm)
      .then(setClients)
      .catch(() => setError("Não foi possível carregar os clientes"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEdit(client: Client) {
    setEditing(client);
    setForm({ name: client.name, phone: client.phone ?? "", email: client.email ?? "", notes: client.notes ?? "" });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      if (editing) {
        await updateClient(editing.id, form);
      } else {
        await createClient(form);
      }
      setShowForm(false);
      load(search);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Erro ao salvar cliente");
    }
  }

  async function handleDelete(client: Client) {
    if (!confirm(`Remover ${client.name}?`)) return;
    await deleteClient(client.id);
    load(search);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl">Clientes</h1>
          <p className="text-muted">{clients.length} cadastrados</p>
        </div>
        <button
          onClick={openCreate}
          className="rounded-xl bg-gradient-to-b from-gold-light to-gold-dark px-4 py-2 font-semibold text-ink"
        >
          + Novo cliente
        </button>
      </div>

      <input
        placeholder="Buscar por nome, e-mail ou telefone"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          load(e.target.value);
        }}
        className="w-full max-w-sm rounded-xl border border-border bg-white px-3 py-2 outline-none focus:border-gold"
      />

      {error && <p className="text-red-600">{error}</p>}

      <div className="overflow-x-auto rounded-2xl border border-border bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-[#FBF8F3] text-muted">
            <tr>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">Telefone</th>
              <th className="px-4 py-3">E-mail</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {!loading && clients.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-muted">
                  Nenhum cliente encontrado.
                </td>
              </tr>
            )}
            {clients.map((client) => (
              <tr key={client.id} className="border-b border-border/60 last:border-0">
                <td className="px-4 py-3 font-medium">{client.name}</td>
                <td className="px-4 py-3 text-muted">{client.phone ?? "—"}</td>
                <td className="px-4 py-3 text-muted">{client.email ?? "—"}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => openEdit(client)} className="mr-3 font-semibold text-gold-dark">
                    Editar
                  </button>
                  <button onClick={() => handleDelete(client)} className="font-semibold text-red-600">
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <Modal title={editing ? "Editar cliente" : "Novo cliente"} onClose={() => setShowForm(false)}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              placeholder="Nome"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="rounded-lg border border-border px-3 py-2 outline-none focus:border-gold"
            />
            <input
              placeholder="Telefone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="rounded-lg border border-border px-3 py-2 outline-none focus:border-gold"
            />
            <input
              type="email"
              placeholder="E-mail"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="rounded-lg border border-border px-3 py-2 outline-none focus:border-gold"
            />
            <textarea
              placeholder="Observações"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="rounded-lg border border-border px-3 py-2 outline-none focus:border-gold"
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button type="submit" className="mt-2 rounded-lg bg-gold-dark px-4 py-2 font-semibold text-white">
              Salvar
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
