"use client";

import { useEffect, useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
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
    <>
      <div className="card overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 border-b border-border-soft p-4">
          <div className="flex min-w-[240px] max-w-[380px] flex-1 items-center gap-2.5 rounded-xl border border-border bg-[#FDFBF7] px-3.5 py-2.5 shadow-soft">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A5998A" strokeWidth="1.8" strokeLinecap="round">
              <circle cx="11" cy="11" r="7"></circle>
              <path d="M20 20l-3.5-3.5"></path>
            </svg>
            <input
              placeholder="Buscar por nome, e-mail ou telefone"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                load(e.target.value);
              }}
              className="w-full border-0 bg-transparent text-[14.5px] outline-none"
            />
          </div>
          <span className="text-[13.5px] font-medium text-muted">{clients.length} cadastrados</span>
          <button onClick={openCreate} className="btn-gold ml-auto">
            Nova cliente
          </button>
        </div>

        {error && <p className="p-4 text-red-600">{error}</p>}

        <div className="hidden grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)_minmax(0,1fr)_120px] bg-[#FCFAF6] px-5 py-3 text-[13px] font-bold uppercase tracking-wide text-[#A5998A] sm:grid">
          <span>Cliente</span>
          <span>E-mail</span>
          <span>Cadastro</span>
          <span />
        </div>

        {!loading && clients.length === 0 && <p className="p-6 text-center text-muted">Nenhum cliente encontrado.</p>}

        {clients.map((client) => (
          <div
            key={client.id}
            className="grid grid-cols-1 items-center gap-2 border-b border-border-soft/70 px-5 py-3.5 last:border-0 hover:bg-[#FDFBF7] sm:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)_minmax(0,1fr)_120px]"
          >
            <div className="flex min-w-0 items-center gap-3">
              <Avatar name={client.name} />
              <div className="min-w-0">
                <div className="truncate text-[15.5px] font-semibold">{client.name}</div>
                <div className="text-[13.5px] text-muted">{client.phone ?? "—"}</div>
              </div>
            </div>
            <span className="min-w-0 truncate text-[14.5px] text-[#4A3F33]">{client.email ?? "—"}</span>
            <span className="min-w-0 truncate text-[14.5px] text-muted">
              {new Date(client.createdAt).toLocaleDateString("pt-BR")}
            </span>
            <div className="flex justify-end gap-3 text-right text-sm font-semibold">
              <button onClick={() => openEdit(client)} className="text-gold-dark">
                Editar
              </button>
              <button onClick={() => handleDelete(client)} className="text-red-600">
                Excluir
              </button>
            </div>
          </div>
        ))}
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
            <button type="submit" className="btn-gold mt-2">
              Salvar
            </button>
          </form>
        </Modal>
      )}
    </>
  );
}
