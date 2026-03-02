'use client';

import { useState, useEffect } from 'react';
import {
  CheckCircle2,
  MessageSquare,
  Clock,
  User2,
  Calendar,
  LayoutDashboard,
  CheckCircle,
  Copy
} from 'lucide-react';

export default function Dashboard() {
  const [prazos, setPrazos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/prazos`);
        const data = await response.json();
        setPrazos(data);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const concluirTarefa = async (id: number) => {
    try {
      await fetch(`${API_URL}/api/concluir/${id}`, { method: 'POST' });
      setPrazos(prazos.map(p => p.id === id ? { ...p, status_atividade: 'concluido' } : p));
    } catch (error) {
      alert("Erro ao atualizar tarefa");
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-[#F8FAFC]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium animate-pulse">Sincronizando dados...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-900 font-sans selection:bg-indigo-100">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <LayoutDashboard className="text-white" size={20} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800 underline decoration-indigo-500/30 underline-offset-4">
              Acadêmico<span className="text-indigo-600">Pro</span>
            </h1>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium text-slate-500 bg-slate-100 px-4 py-2 rounded-full">
            <Calendar size={16} className="text-indigo-500" />
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-8">
        <header className="mb-12">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-2">Hub de Gestão</h2>
          <p className="text-slate-500 text-lg">Bem-vindo, Eduardo. Aqui está o panorama dos seus prazos e encaminhamentos.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-300 pb-4">
              <h3 className="flex items-center gap-3 text-2xl font-bold text-slate-800">
                <div className="bg-blue-100 p-2 rounded-full text-blue-600"><User2 size={24} /></div>
                Minhas Atividades (AS)
              </h3>
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                {prazos.filter(p => p.executor === 'Eduardo' && p.status_atividade !== 'concluido').length} Pendentes
              </span>
            </div>

            <div className="grid gap-4">
              {prazos.filter(p => p.executor === 'Eduardo').map((item) => (
                <TarefaCard key={item.id} item={item} onDone={concluirTarefa} isEduardo={true} />
              ))}
            </div>
          </section>

    
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-300 pb-4">
              <h3 className="flex items-center gap-3 text-2xl font-bold text-slate-800">
                <div className="bg-purple-100 p-2 rounded-full text-purple-600"><MessageSquare size={24} /></div>
                Para Encaminhar (Ana)
              </h3>
              <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                {prazos.filter(p => p.executor === 'Ana' && p.status_atividade !== 'concluido').length} Envios
              </span>
            </div>

            <div className="grid gap-4">
              {prazos.filter(p => p.executor === 'Ana').map((item) => (
                <TarefaCard key={item.id} item={item} onDone={concluirTarefa} isEduardo={false} />
              ))}
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}

function TarefaCard({ item, onDone, isEduardo }: any) {
  const estaConcluido = item.status_atividade === 'concluido';

  return (
    <div className={`group relative p-6 rounded-2xl border transition-all duration-300 overflow-hidden
      ${estaConcluido
        ? 'bg-slate-50 border-slate-200 opacity-60'
        : 'bg-white border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(79,70,229,0.1)] hover:-translate-y-1'
      }`}>


      <div className={`absolute left-0 top-0 bottom-0 w-1.5 transition-all ${estaConcluido ? 'bg-slate-300' : (item.tipo === 'Prova' ? 'bg-rose-500' : 'bg-emerald-500')}`} />

      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest
            ${item.tipo === 'Prova' ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
            {item.tipo}
          </span>
          {estaConcluido && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-200 px-2 py-1 rounded-lg uppercase">
              <CheckCircle size={10} /> Finalizado
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-slate-400 font-medium text-xs">
          <Clock size={14} className="group-hover:text-indigo-500 transition-colors" />
          {item.data_entrega}
        </div>
      </div>

      <div className="space-y-2">
        <h4 className={`text-lg font-bold leading-tight transition-colors ${estaConcluido ? 'text-slate-500 line-through' : 'text-slate-800 group-hover:text-indigo-600'}`}>
          {item.disciplina}
        </h4>
        <p className="text-sm text-slate-500 leading-relaxed italic">
          {item.descricao_trabalho}
        </p>
      </div>

      <div className="mt-6 flex items-center gap-3">
        {!estaConcluido && (
          <>
            <button
              onClick={() => onDone(item.id)}
              className="flex-1 flex items-center justify-center gap-2 bg-slate-900 hover:bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-lg shadow-slate-200 hover:shadow-indigo-200"
            >
              <CheckCircle2 size={16} /> Marcar Concluído
            </button>

            {!isEduardo && (
              <button
                onClick={() => {
                  const msg = `🔔 *Lembrete Acadêmico*\n\n📚 *Disciplina:* ${item.disciplina}\n⏳ *Vencimento:* ${item.data_entrega}\n\nPor favor, verifique com o responsável o andamento desta atividade.`;

        
                  if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(msg)
                      .then(() => alert("Mensagem formatada copiada!"))
                      .catch(() => alert("Erro ao copiar mensagem automaticamente."));
                  } else {
                    alert("Segurança do navegador bloqueou o acesso automático.\n\nCopie manualmente:\n" + msg);
                    console.log(msg);
                  }
                }}
                className="flex items-center justify-center bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 p-2.5 rounded-xl transition-all active:scale-95"
                title="Copiar para WhatsApp"
              >
                <Copy size={18} />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}