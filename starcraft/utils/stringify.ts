export function stringify(val, depth, replacer, space) {
  depth = isNaN(+depth) ? 1 : depth;
  function _build(val: any, depth: any, o?: any, a?: any) { // (JSON.stringify() has it's own rules, which we respect here by using it for property iteration)
      return !val || typeof val != 'object' ?
        val :
        (a=Array.isArray(val), JSON.stringify(val, function(k,v){
          if (a || depth > 0) {
            if (replacer) v=replacer(k,v);
            if (!k) return (a=Array.isArray(v),val=v);
            !o && (o=a?[]:{});
            o[k] = _build(v, a?depth:depth-1);
          }
        }), o||(a?`[array (${val.length})]`:`{object (${Object.keys(val).length})}`));
  }
  return JSON.stringify(_build(val, depth), null, space);
}
