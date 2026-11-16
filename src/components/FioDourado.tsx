/**
 * O fio dourado: 1px contínuo na margem esquerda, do título do topo até o fim do conteúdo.
 * Os primeiros 120px descem na carga (CSS); o resto cresce com a rolagem (RolagemSuave anima `data-fio`).
 * Fica dentro de um elemento `relative` que envolve as seções.
 */
export function FioDourado() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-(--respiro-topo) bottom-0 z-10">
      <div className="conteiner relative h-full">
        <div className="absolute inset-y-0 left-[calc(var(--margem)/2)] w-px">
          <div className="fio-nascente h-30 bg-ouro" />
          <div data-fio suppressHydrationWarning className="fio-resto absolute inset-x-0 top-30 bottom-0 origin-top bg-ouro" />
        </div>
      </div>
    </div>
  );
}
