import React from "react";
import { VERSOES } from "../data/novidades";
import { Card } from "./ModuloUI";

export function Novidades() {
  return (
    <Card>
      <strong className="block mb-4">Novidades e Atualizações</strong>
      <div className="space-y-5">
        {VERSOES.map((v) => (
          <div key={v.versao} className="border-l-2 border-ledger pl-4">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="font-mono text-sm text-ledger font-semibold">v{v.versao}</span>
              <span className="text-xs text-inksoft">{new Date(v.data + "T00:00:00").toLocaleDateString("pt-BR")}</span>
            </div>
            <ul className="text-sm text-inksoft list-disc pl-5 space-y-0.5">
              {v.descricao.map((linha, i) => <li key={i}>{linha}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </Card>
  );
}
