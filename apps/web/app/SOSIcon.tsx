import type { SVGProps } from 'react';

export function SOSIconSprite(){
 return <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{position:'absolute',width:0,height:0,overflow:'hidden'}}>
 <defs>
 <symbol id="sos-home" viewBox="0 0 24 24"><path d="M3 10.5 12 3l9 7.5M5 9.5V21h14V9.5M10 21v-6h4v6"/></symbol>
 <symbol id="sos-family" viewBox="0 0 24 24"><circle cx="12" cy="7" r="3"/><circle cx="5.5" cy="9" r="2.2"/><circle cx="18.5" cy="9" r="2.2"/><path d="M7 20v-2a5 5 0 0 1 10 0v2M2 20v-1.5A3.5 3.5 0 0 1 5.5 15M22 20v-1.5a3.5 3.5 0 0 0-3.5-3.5"/></symbol>
 <symbol id="sos-medkit" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M12 10.5v6M9 13.5h6"/></symbol>
 <symbol id="sos-water" viewBox="0 0 24 24"><path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/></symbol>
 <symbol id="sos-food" viewBox="0 0 24 24"><path d="M6 3v7a2 2 0 0 0 2 2v9M10 3v7a2 2 0 0 1-2 2M8 3v6M17 21V3c-2 1-3 3.5-3 7s1 4 3 4"/></symbol>
 <symbol id="sos-shelter" viewBox="0 0 24 24"><path d="M2 20h20M12 4 4 20m8-16 8 16m-8-7.5L9 20h6z"/></symbol>
 <symbol id="sos-fire" viewBox="0 0 24 24"><path d="M12 21a6 6 0 0 0 6-6c0-3.5-2.5-6-3.5-9-1 2-2 3-3.5 3.5C11 7 10.5 5 11 3c-3 2-5 6-5 9.5A6 6 0 0 0 12 21z"/></symbol>
 <symbol id="sos-compass" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/></symbol>
 <symbol id="sos-radio" viewBox="0 0 24 24"><rect x="3" y="8" width="18" height="12" rx="2"/><path d="m7 8 9-5"/><circle cx="16" cy="14" r="2.5"/><path d="M6 12h4M6 15h4M6 18h4"/></symbol>
 <symbol id="sos-mountain" viewBox="0 0 24 24"><path d="M2 19 9 7l4 6 2.5-3.5L22 19"/></symbol>
 <symbol id="sos-shield" viewBox="0 0 24 24"><path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6zM8.5 12l2.5 2.5 4.5-5"/></symbol>
 <symbol id="sos-alert" viewBox="0 0 24 24"><path d="M12 3 2 20h20L12 3zM12 10v4.5M12 17.5v.01"/></symbol>
 <symbol id="sos-check" viewBox="0 0 24 24"><path d="M9 4H7a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2"/><rect x="9" y="2.5" width="6" height="3" rx="1"/><path d="m9 13 2 2 4-4"/></symbol>
 <symbol id="sos-guide" viewBox="0 0 24 24"><path d="m12 3 9 4.5-9 4.5-9-4.5zM3 12l9 4.5 9-4.5M3 16.5l9 4.5 9-4.5"/></symbol>
 <symbol id="sos-pin" viewBox="0 0 24 24"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></symbol>
 <symbol id="sos-phone" viewBox="0 0 24 24"><path d="M5 3h3.5l1.5 5-2.5 1.5a11 11 0 0 0 7 7L16 14l5 1.5V19a2 2 0 0 1-2 2C10.7 21 3 13.3 3 5a2 2 0 0 1 2-2z"/></symbol>
 <symbol id="sos-book" viewBox="0 0 24 24"><path d="M12 6c-2-1.5-5-2-9-2v15c4 0 7 .5 9 2 2-1.5 5-2 9-2V4c-4 0-7 .5-9 2zM12 6v15"/></symbol>
 <symbol id="sos-map" viewBox="0 0 24 24"><path d="M3 6.5 9 4l6 2.5L21 4v13.5L15 20l-6-2.5L3 20zM9 4v13.5M15 6.5V20"/></symbol>
 <symbol id="sos-gear" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 2v4m0 12v4M2 12h4m12 0h4M5 5l3 3m8 8 3 3M19 5l-3 3M8 16l-3 3"/></symbol>
 <symbol id="sos-more" viewBox="0 0 24 24"><rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><path d="M17 13.5v7M13.5 17h7"/></symbol>
 </defs></svg>;
}
const map:Record<string,string>={
 '⌂':'home','♧':'family','▣':'medkit','☎':'phone','◉':'water','☷':'food','✚':'medkit','✦':'guide',
 '⚠':'alert','☑':'check','△':'mountain','◈':'compass','♨':'fire','⚙':'gear','⬡':'shield',
 '▲':'mountain','▤':'book','⤓':'check','▱':'guide','⇄':'compass'
};
export function SOSIcon({name,...props}:SVGProps<SVGSVGElement>&{name:string}){
 const icon=map[name]||name;
 return <svg {...props} className={'sos-icon '+(props.className||'')} aria-hidden="true" viewBox="0 0 24 24"><use href={'#sos-'+icon}/></svg>;
}
