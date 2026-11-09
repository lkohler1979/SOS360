'use client';
import type { CSSProperties } from 'react';

export type Supplies = {
  people: number;
  days: number;
  waterLiters: number;
  meals: number;
  tasks: Record<string,boolean>;
};
export const defaultSupplies:Supplies = {people:4,days:3,waterLiters:0,meals:0,tasks:{}};
const waterRate=3;
const mealRate=3;
const tasks=[
  ['storage','Separar recipientes limpos e próprios para água potável'],
  ['labels','Identificar datas e revisar a validade dos suprimentos'],
  ['food','Priorizar alimentos não perecíveis e prontos para consumo'],
  ['manual','Separar abridor manual e utensílios básicos'],
  ['needs','Considerar bebês, idosos, alergias e animais de estimação'],
  ['rotation','Programar uma revisão periódica do estoque'],
];
const box:CSSProperties={border:'1px solid #e7ecee',borderRadius:14,padding:16,background:'#fafcfc'};
export default function SuppliesModule({value,onChange}:{value:Supplies;onChange:(value:Supplies)=>void}){
 const people=Math.min(30,Math.max(1,Math.floor(value.people)||1));
 const days=Math.min(14,Math.max(1,Math.floor(value.days)||1));
 const liters=people*days*waterRate;
 const meals=people*days*mealRate;
 const set=(patch:Partial<Supplies>)=>onChange({...value,...patch});
 const waterProgress=Math.min(100,Math.round(value.waterLiters/liters*100));
 const mealProgress=Math.min(100,Math.round(value.meals/meals*100));
 return <section className="panel supplies">
   <div className="supplies-intro"><div><span className="overline">SOS FAMILY / PREPARAÇÃO</span><h2>💧 Água e alimentação</h2><p>Planeje o mínimo inicial de suprimentos para sua família e acompanhe o que já está separado.</p></div><div className="supplies-illustration" aria-hidden="true">💧🥫</div></div>
   <div className="supplies-controls">
    <label><span className="field-label">Pessoas</span><input className="field" aria-label="Número de pessoas" type="number" min={1} max={30} step={1} value={people} onChange={e=>set({people:Math.min(30,Math.max(1,Number(e.target.value)||1))})}/></label>
    <label><span className="field-label">Dias de autonomia</span><input className="field" aria-label="Dias de autonomia" type="number" min={1} max={14} step={1} value={days} onChange={e=>set({days:Math.min(14,Math.max(1,Number(e.target.value)||1))})}/></label>
   </div>
   <div className="supply-stats">
    <div style={box}><span className="overline">ÁGUA POTÁVEL</span><div className="supply-number">{liters} <small>litros</small></div><p>Estimativa inicial de {waterRate} L/pessoa/dia para beber e preparação simples; calor, esforço e necessidades individuais podem exigir mais.</p></div>
    <div style={box}><span className="overline">ALIMENTAÇÃO</span><div className="supply-number">{meals} <small>refeições</small></div><p>Planejamento de {mealRate} refeições por pessoa ao dia, adaptado à idade e às necessidades nutricionais.</p></div>
   </div>
   <h3>Seu estoque atual</h3>
   <div className="supplies-controls">
    <label><span className="field-label">Água potável armazenada (L)</span><input className="field" type="number" aria-label="Litros armazenados" min={0} max={100000} step={0.5} value={value.waterLiters} onChange={e=>set({waterLiters:Math.min(100000,Math.max(0,Number(e.target.value)||0))})}/><span className="supply-helper">{Math.max(0,liters-value.waterLiters).toLocaleString('pt-BR')} L ainda necessários nesta estimativa</span></label>
    <label><span className="field-label">Refeições disponíveis</span><input className="field" type="number" aria-label="Refeições armazenadas" min={0} max={100000} step={1} value={value.meals} onChange={e=>set({meals:Math.min(100000,Math.max(0,Math.floor(Number(e.target.value)||0)))})}/><span className="supply-helper">{Math.max(0,meals-value.meals)} refeições restantes</span></label>
   </div>
   <div className="supply-progress-group"><div><strong>Água</strong><span>{waterProgress}%</span></div><div className="progress"><div style={{width:waterProgress+'%'}}/></div><div><strong>Alimentação</strong><span>{mealProgress}%</span></div><div className="progress"><div style={{width:mealProgress+'%'}}/></div></div>
   <h3>Checklist de preparação</h3>
   {tasks.map(([id,label])=><div key={id} className="check"><label><input type="checkbox" checked={Boolean(value.tasks[id])} onChange={()=>set({tasks:{...value.tasks,[id]:!value.tasks[id]}})}/>{label}</label></div>)}
   <div className="supply-note"><strong>Orientação de segurança</strong><p>Use apenas água segura para consumo. Em caso de suspeita de contaminação ou alerta sanitário, siga as instruções da autoridade local. O cálculo é uma referência de planejamento, não uma garantia de segurança ou suficiência.</p></div>
 </section>
}