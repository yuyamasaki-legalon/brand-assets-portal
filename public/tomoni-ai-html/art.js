(function () {
  'use strict';

  const C = { ink: '#15262d', paper: '#fbf9f4', lime: '#d1ff70', lavender: '#c4b5fd', mint: '#d8f1ed' };
  const open = (name) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" fill="none" role="img" aria-label="${name}" class="tomoni-art" stroke-linecap="round" stroke-linejoin="round">`;
  const star = (x, y, s, fill = C.lime) => `<path d="M${x} ${y-s} Q${x+s*.2} ${y-s*.2} ${x+s} ${y} Q${x+s*.2} ${y+s*.2} ${x} ${y+s} Q${x-s*.2} ${y+s*.2} ${x-s} ${y} Q${x-s*.2} ${y-s*.2} ${x} ${y-s}Z" fill="${fill}" stroke="${C.ink}" stroke-width="4"/>`;
  const face = (celebrate) => celebrate
    ? `<path d="M161 171Q172 156 184 171M220 171Q232 156 244 171" stroke="${C.ink}" stroke-width="7"/><path d="M189 192Q201 204 215 191" stroke="${C.ink}" stroke-width="5"/>`
    : `<path d="M159 145L180 139M223 139L243 145" stroke="${C.ink}" stroke-width="5"/><rect x="166" y="161" width="12" height="21" rx="6" fill="${C.ink}"/><rect x="227" y="161" width="12" height="21" rx="6" fill="${C.ink}"/><path d="M188 195Q200 204 216 190" stroke="${C.ink}" stroke-width="5"/>`;

  function buddy(variant = 'normal') {
    const celebrating = variant === 'celebrate';
    const searching = variant === 'search';
    const guarding = variant === 'guard';
    const background = guarding
      ? `<g class="buddy-aura"><circle cx="200" cy="196" r="151" fill="${C.mint}"/><path d="M84 281A145 145 0 0 1 78 120M280 81A145 145 0 0 1 330 246" stroke="${C.ink}" stroke-width="4" stroke-dasharray="8 13"/>${star(315,77,18,C.lavender)}${star(67,249,14,C.lime)}</g>`
      : `<circle cx="200" cy="196" r="145" fill="${searching ? C.mint : C.lavender}"/><g class="buddy-spark">${star(74,103,19)}${star(326,258,13,C.paper)}<path d="M310 85l14-10M324 105l19-2" stroke="${C.ink}" stroke-width="4"/></g>`;
    const leftArm = celebrating
      ? `<path class="buddy-hand buddy-hand-left" d="M112 180C85 167 66 133 71 115C74 102 88 105 93 119L123 150" fill="${C.paper}" stroke="${C.ink}" stroke-width="6"/>`
      : `<path class="buddy-hand buddy-hand-left" d="M112 180C81 185 72 211 84 226C94 237 111 218 122 211" fill="${C.paper}" stroke="${C.ink}" stroke-width="6"/>`;
    const rightArm = searching
      ? `<g class="buddy-hand buddy-hand-right"><path d="M288 179C309 171 325 169 333 181C341 194 319 213 292 213" fill="${C.paper}" stroke="${C.ink}" stroke-width="6"/><path d="M326 149L347 188" stroke="${C.ink}" stroke-width="14"/><circle cx="306" cy="119" r="39" fill="${C.lime}" stroke="${C.ink}" stroke-width="6"/><circle cx="306" cy="119" r="28" fill="${C.paper}" stroke="${C.ink}" stroke-width="3"/><path class="scan-beam" d="M288 113L312 101" stroke="${C.mint}" stroke-width="10"/></g>`
      : `<path class="buddy-hand buddy-hand-right" d="M285 173C306 160 318 129 311 114C305 102 292 109 291 124L274 148" fill="${C.paper}" stroke="${C.ink}" stroke-width="6"/>`;
    const confetti = celebrating ? `<g class="buddy-confetti"><path d="M78 55l-8-16M313 53l10-16M348 154l17 3" stroke="${C.ink}" stroke-width="5"/><path d="M145 47l7-18M267 43l-8-16" stroke="${C.lime}" stroke-width="9"/>${star(333,82,16,C.lime)}${star(55,176,13,C.paper)}<circle cx="99" cy="302" r="8" fill="${C.lime}" stroke="${C.ink}" stroke-width="4"/></g>` : '';
    return `${open('TOMONI AIの頼れる相棒')}${background}<ellipse class="buddy-shadow" cx="202" cy="340" rx="97" ry="15" fill="${C.ink}" opacity=".12"/><g class="buddy-body">${leftArm}${rightArm}<path d="M153 292L145 321Q144 332 158 333L183 333Q195 332 190 320L183 295M220 295L216 321Q214 333 228 333L250 333Q264 331 259 319L247 289" fill="${C.ink}"/><path d="M108 123C110 84 144 66 178 77C191 81 209 81 222 77C256 66 290 84 292 123L287 219C284 265 245 298 200 317C155 298 116 265 113 219Z" fill="${C.paper}" stroke="${C.ink}" stroke-width="6"/><path d="M131 225C139 257 167 281 200 296C229 283 253 263 266 235" stroke="${C.mint}" stroke-width="10"/><g class="buddy-eyes">${face(celebrating)}</g><path class="buddy-badge" d="M190 227L201 221L213 227L212 241Q210 250 201 254Q192 250 190 241Z" fill="${C.lime}" stroke="${C.ink}" stroke-width="4"/><path d="M196 237l4 4 7-8" stroke="${C.ink}" stroke-width="3"/></g>${confetti}</svg>`;
  }

  function creator() {
    return `${open('個人クリエイター')}<circle cx="200" cy="202" r="145" fill="${C.lavender}"/><ellipse cx="197" cy="339" rx="112" ry="12" fill="${C.ink}" opacity=".1"/><path d="M119 245C121 201 146 182 200 182C254 182 278 203 281 245L290 325H110Z" fill="${C.mint}" stroke="${C.ink}" stroke-width="6"/><path d="M141 153C116 109 147 62 196 62C247 60 279 97 261 155L247 205H152Z" fill="${C.ink}" stroke="${C.ink}" stroke-width="6"/><path d="M158 118C173 120 198 104 209 90C215 111 232 122 247 125L242 169C237 196 217 210 201 210C177 210 158 189 156 169Z" fill="${C.paper}" stroke="${C.ink}" stroke-width="5"/><rect x="158" y="137" width="35" height="25" rx="12" stroke="${C.ink}" stroke-width="4"/><rect x="209" y="137" width="35" height="25" rx="12" stroke="${C.ink}" stroke-width="4"/><path d="M193 148h16M190 181Q202 190 214 179" stroke="${C.ink}" stroke-width="4"/><path d="M133 245l-19 43M269 246l18 42" stroke="${C.ink}" stroke-width="5"/><path d="M132 252H267L253 325H147Z" fill="${C.paper}" stroke="${C.ink}" stroke-width="6"/><path d="M187 285l10 9 19-22" stroke="${C.ink}" stroke-width="5"/>${star(303,98,21,C.lime)}<path d="M93 174l-12 7M97 197l-14-2" stroke="${C.ink}" stroke-width="4"/></svg>`;
  }

  function company() {
    return `${open('IPを活用する企業')}<circle cx="200" cy="202" r="145" fill="${C.mint}"/><ellipse cx="200" cy="337" rx="121" ry="12" fill="${C.ink}" opacity=".1"/><path d="M101 159L200 108L299 159V324H101Z" fill="${C.paper}" stroke="${C.ink}" stroke-width="6"/><path d="M81 163L200 101L319 163" stroke="${C.ink}" stroke-width="8"/><path d="M171 324V263H229V324" fill="${C.lavender}" stroke="${C.ink}" stroke-width="5"/><path d="M127 195H155V226H127ZM185 177H215V208H185ZM245 195H273V226H245Z" fill="${C.lime}" stroke="${C.ink}" stroke-width="5"/><path d="M200 53V80M160 64l10 20M240 64l-10 20" stroke="${C.ink}" stroke-width="5"/>${star(322,251,20,C.lavender)}${star(75,112,14,C.paper)}</svg>`;
  }

  function school() {
    return `${open('次世代のクリエイターを育てる学校')}<circle cx="200" cy="202" r="145" fill="${C.lime}"/><ellipse cx="200" cy="337" rx="121" ry="12" fill="${C.ink}" opacity=".1"/><path d="M99 230Q150 203 200 230Q250 203 301 230V320Q250 293 200 320Q150 293 99 320Z" fill="${C.paper}" stroke="${C.ink}" stroke-width="6"/><path d="M200 231V319M125 249l47-2M125 272l47-2M229 247l46 2M229 270l46 2" stroke="${C.ink}" stroke-width="4"/><path d="M137 143V184Q200 218 263 184V143" fill="${C.lavender}" stroke="${C.ink}" stroke-width="6"/><path d="M83 128L200 76L317 128L200 180Z" fill="${C.paper}" stroke="${C.ink}" stroke-width="6"/><path d="M317 129V203" stroke="${C.ink}" stroke-width="5"/><path d="M308 210L317 192L326 210V225H308Z" fill="${C.lavender}" stroke="${C.ink}" stroke-width="4"/>${star(81,190,16,C.lavender)}${star(301,64,13,C.mint)}</svg>`;
  }

  function shield() {
    return `${open('権利を守る')}<circle cx="200" cy="202" r="145" fill="${C.lavender}"/><path d="M99 117Q149 110 200 75Q251 110 301 117V201C300 263 250 307 200 333C150 307 100 263 99 201Z" fill="${C.paper}" stroke="${C.ink}" stroke-width="7"/><path d="M127 138Q167 128 200 106Q233 128 273 138V201C271 246 236 279 200 301C164 279 129 246 127 201Z" fill="${C.mint}" stroke="${C.ink}" stroke-width="4"/><path d="M157 204l29 30 59-68" stroke="${C.ink}" stroke-width="14"/>${star(317,86,21,C.lime)}${star(77,271,14,C.lime)}</svg>`;
  }

  function search() {
    return `${open('侵害の候補を見つける')}<circle cx="200" cy="202" r="145" fill="${C.mint}"/><path d="M231 236L316 321" stroke="${C.ink}" stroke-width="38"/><path d="M245 249L305 310" stroke="${C.lavender}" stroke-width="21"/><circle cx="173" cy="178" r="93" fill="${C.paper}" stroke="${C.ink}" stroke-width="7"/><circle cx="173" cy="178" r="71" fill="${C.lime}" stroke="${C.ink}" stroke-width="4"/><path class="scan-beam" d="M120 174H225" stroke="${C.ink}" stroke-width="5" stroke-dasharray="5 9"/><path d="M163 148h20v37h-20Z" fill="${C.ink}"/><circle cx="173" cy="204" r="7" fill="${C.ink}"/>${star(312,96,20,C.lavender)}<path d="M77 287l-14 14M91 306l-7 18" stroke="${C.ink}" stroke-width="5"/></svg>`;
  }

  function link() {
    return `${open('正規の利用につなぐ')}<circle cx="200" cy="202" r="145" fill="${C.lavender}"/><g transform="rotate(-39 200 200)"><rect x="76" y="145" width="168" height="110" rx="55" fill="${C.paper}" stroke="${C.ink}" stroke-width="7"/><rect x="156" y="145" width="168" height="110" rx="55" fill="${C.lime}" stroke="${C.ink}" stroke-width="7"/><path d="M184 173H143C128 173 120 184 120 200C120 216 129 227 143 227H184" stroke="${C.ink}" stroke-width="6"/><path d="M216 173H257C272 173 280 184 280 200C280 216 271 227 257 227H216" stroke="${C.ink}" stroke-width="6"/><path d="M169 200H231" stroke="${C.ink}" stroke-width="10"/></g>${star(303,90,20,C.mint)}${star(89,302,15,C.paper)}</svg>`;
  }

  window.TomoniArt = { buddy, creator, company, school, shield, search, link };
}());
