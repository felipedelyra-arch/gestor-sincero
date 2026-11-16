export type TipoCampo = "text" | "email" | "tel" | "select" | "textarea";

type Props = {
  id: string;
  nome: string;
  rotulo: string;
  ajuda?: string;
  erro?: string;
  tipo?: TipoCampo;
  /** Só para `select`: valor -> rótulo. */
  opcoes?: Record<string, string>;
  obrigatorio?: boolean;
  autoComplete?: string;
  className?: string;
};

export function IconeErro() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="mt-[0.3em] size-4 shrink-0">
      <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 4.5v4.5M8 11.2v.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

const caixa =
  "w-full rounded-base border border-chumbo bg-preto-2 px-4 text-corpo text-texto aria-invalid:border-erro";

/** Rótulo sempre visível acima; ajuda e erro ligados por aria-describedby. */
export function Campo({ id, nome, rotulo, ajuda, erro, tipo = "text", opcoes, obrigatorio, autoComplete, className }: Props) {
  const idAjuda = ajuda ? `${id}-ajuda` : undefined;
  const idErro = erro ? `${id}-erro` : undefined;
  const comum = {
    id,
    name: nome,
    autoComplete,
    "aria-required": obrigatorio || undefined,
    "aria-invalid": erro ? true : undefined,
    "aria-describedby": [idAjuda, idErro].filter(Boolean).join(" ") || undefined,
  };

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block font-medium">
        {rotulo}
      </label>
      {tipo === "textarea" ? (
        <textarea {...comum} rows={3} className={`${caixa} py-3`} />
      ) : tipo === "select" ? (
        <select {...comum} defaultValue="" className={`${caixa} h-14`}>
          <option value="" />
          {Object.entries(opcoes ?? {}).map(([valor, texto]) => (
            <option key={valor} value={valor}>
              {texto}
            </option>
          ))}
        </select>
      ) : (
        <input {...comum} type={tipo} inputMode={tipo === "text" ? undefined : tipo} className={`${caixa} h-14`} />
      )}
      {ajuda && (
        <p id={idAjuda} className="mt-2 text-apoio text-texto-2">
          {ajuda}
        </p>
      )}
      {erro && (
        <p id={idErro} className="mt-2 flex gap-2 text-apoio text-erro">
          <IconeErro />
          {erro}
        </p>
      )}
    </div>
  );
}
