(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function e(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(i){if(i.ep)return;i.ep=!0;const s=e(i);fetch(i.href,s)}})();const ma="179",Hh=0,Ha=1,Wh=2,Ll=1,Xh=2,zn=3,Qn=0,Be=1,Bn=2,Kn=0,ki=1,Wa=2,Xa=3,qa=4,qh=5,fi=100,Yh=101,$h=102,Zh=103,jh=104,Kh=200,Jh=201,Qh=202,tu=203,bo=204,wo=205,eu=206,nu=207,iu=208,su=209,ru=210,ou=211,au=212,cu=213,lu=214,Ao=0,Ro=1,Co=2,Wi=3,Po=4,Io=5,Lo=6,Do=7,Dl=0,hu=1,uu=2,Jn=0,du=1,fu=2,pu=3,mu=4,gu=5,_u=6,vu=7,Nl=300,Xi=301,qi=302,No=303,Uo=304,Tr=306,Fo=1e3,gi=1001,Oo=1002,fn=1003,xu=1004,Cs=1005,Sn=1006,Ir=1007,_i=1008,bn=1009,Ul=1010,Fl=1011,ms=1012,ga=1013,vi=1014,kn=1015,Ms=1016,_a=1017,va=1018,gs=1020,Ol=35902,zl=1021,Bl=1022,un=1023,_s=1026,vs=1027,kl=1028,xa=1029,Vl=1030,ya=1031,Ma=1033,ar=33776,cr=33777,lr=33778,hr=33779,zo=35840,Bo=35841,ko=35842,Vo=35843,Go=36196,Ho=37492,Wo=37496,Xo=37808,qo=37809,Yo=37810,$o=37811,Zo=37812,jo=37813,Ko=37814,Jo=37815,Qo=37816,ta=37817,ea=37818,na=37819,ia=37820,sa=37821,ur=36492,ra=36494,oa=36495,Gl=36283,aa=36284,ca=36285,la=36286,yu=3200,Mu=3201,Hl=0,Su=1,jn="",je="srgb",Yi="srgb-linear",mr="linear",ne="srgb",Mi=7680,Ya=519,Eu=512,Tu=513,bu=514,Wl=515,wu=516,Au=517,Ru=518,Cu=519,$a=35044,Za="300 es",En=2e3,gr=2001;class ji{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){const n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){const n=this._listeners;if(n===void 0)return;const i=n[t];if(i!==void 0){const s=i.indexOf(e);s!==-1&&i.splice(s,1)}}dispatchEvent(t){const e=this._listeners;if(e===void 0)return;const n=e[t.type];if(n!==void 0){t.target=this;const i=n.slice(0);for(let s=0,o=i.length;s<o;s++)i[s].call(this,t);t.target=null}}}const Re=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],dr=Math.PI/180,ha=180/Math.PI;function Ss(){const r=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Re[r&255]+Re[r>>8&255]+Re[r>>16&255]+Re[r>>24&255]+"-"+Re[t&255]+Re[t>>8&255]+"-"+Re[t>>16&15|64]+Re[t>>24&255]+"-"+Re[e&63|128]+Re[e>>8&255]+"-"+Re[e>>16&255]+Re[e>>24&255]+Re[n&255]+Re[n>>8&255]+Re[n>>16&255]+Re[n>>24&255]).toLowerCase()}function Gt(r,t,e){return Math.max(t,Math.min(e,r))}function Pu(r,t){return(r%t+t)%t}function Lr(r,t,e){return(1-e)*r+e*t}function ts(r,t){switch(t.constructor){case Float32Array:return r;case Uint32Array:return r/4294967295;case Uint16Array:return r/65535;case Uint8Array:return r/255;case Int32Array:return Math.max(r/2147483647,-1);case Int16Array:return Math.max(r/32767,-1);case Int8Array:return Math.max(r/127,-1);default:throw new Error("Invalid component type.")}}function Ve(r,t){switch(t.constructor){case Float32Array:return r;case Uint32Array:return Math.round(r*4294967295);case Uint16Array:return Math.round(r*65535);case Uint8Array:return Math.round(r*255);case Int32Array:return Math.round(r*2147483647);case Int16Array:return Math.round(r*32767);case Int8Array:return Math.round(r*127);default:throw new Error("Invalid component type.")}}class Kt{constructor(t=0,e=0){Kt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,i=t.elements;return this.x=i[0]*e+i[3]*n+i[6],this.y=i[1]*e+i[4]*n+i[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Gt(this.x,t.x,e.x),this.y=Gt(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=Gt(this.x,t,e),this.y=Gt(this.y,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Gt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Gt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),i=Math.sin(e),s=this.x-t.x,o=this.y-t.y;return this.x=s*n-o*i+t.x,this.y=s*i+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}let Es=class{constructor(t=0,e=0,n=0,i=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=i}static slerpFlat(t,e,n,i,s,o,a){let l=n[i+0],c=n[i+1],h=n[i+2],d=n[i+3];const u=s[o+0],p=s[o+1],g=s[o+2],_=s[o+3];if(a===0){t[e+0]=l,t[e+1]=c,t[e+2]=h,t[e+3]=d;return}if(a===1){t[e+0]=u,t[e+1]=p,t[e+2]=g,t[e+3]=_;return}if(d!==_||l!==u||c!==p||h!==g){let m=1-a;const f=l*u+c*p+h*g+d*_,v=f>=0?1:-1,S=1-f*f;if(S>Number.EPSILON){const w=Math.sqrt(S),A=Math.atan2(w,f*v);m=Math.sin(m*A)/w,a=Math.sin(a*A)/w}const x=a*v;if(l=l*m+u*x,c=c*m+p*x,h=h*m+g*x,d=d*m+_*x,m===1-a){const w=1/Math.sqrt(l*l+c*c+h*h+d*d);l*=w,c*=w,h*=w,d*=w}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=d}static multiplyQuaternionsFlat(t,e,n,i,s,o){const a=n[i],l=n[i+1],c=n[i+2],h=n[i+3],d=s[o],u=s[o+1],p=s[o+2],g=s[o+3];return t[e]=a*g+h*d+l*p-c*u,t[e+1]=l*g+h*u+c*d-a*p,t[e+2]=c*g+h*p+a*u-l*d,t[e+3]=h*g-a*d-l*u-c*p,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,i){return this._x=t,this._y=e,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,i=t._y,s=t._z,o=t._order,a=Math.cos,l=Math.sin,c=a(n/2),h=a(i/2),d=a(s/2),u=l(n/2),p=l(i/2),g=l(s/2);switch(o){case"XYZ":this._x=u*h*d+c*p*g,this._y=c*p*d-u*h*g,this._z=c*h*g+u*p*d,this._w=c*h*d-u*p*g;break;case"YXZ":this._x=u*h*d+c*p*g,this._y=c*p*d-u*h*g,this._z=c*h*g-u*p*d,this._w=c*h*d+u*p*g;break;case"ZXY":this._x=u*h*d-c*p*g,this._y=c*p*d+u*h*g,this._z=c*h*g+u*p*d,this._w=c*h*d-u*p*g;break;case"ZYX":this._x=u*h*d-c*p*g,this._y=c*p*d+u*h*g,this._z=c*h*g-u*p*d,this._w=c*h*d+u*p*g;break;case"YZX":this._x=u*h*d+c*p*g,this._y=c*p*d+u*h*g,this._z=c*h*g-u*p*d,this._w=c*h*d-u*p*g;break;case"XZY":this._x=u*h*d-c*p*g,this._y=c*p*d-u*h*g,this._z=c*h*g+u*p*d,this._w=c*h*d+u*p*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,i=Math.sin(n);return this._x=t.x*i,this._y=t.y*i,this._z=t.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],i=e[4],s=e[8],o=e[1],a=e[5],l=e[9],c=e[2],h=e[6],d=e[10],u=n+a+d;if(u>0){const p=.5/Math.sqrt(u+1);this._w=.25/p,this._x=(h-l)*p,this._y=(s-c)*p,this._z=(o-i)*p}else if(n>a&&n>d){const p=2*Math.sqrt(1+n-a-d);this._w=(h-l)/p,this._x=.25*p,this._y=(i+o)/p,this._z=(s+c)/p}else if(a>d){const p=2*Math.sqrt(1+a-n-d);this._w=(s-c)/p,this._x=(i+o)/p,this._y=.25*p,this._z=(l+h)/p}else{const p=2*Math.sqrt(1+d-n-a);this._w=(o-i)/p,this._x=(s+c)/p,this._y=(l+h)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Gt(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const i=Math.min(1,e/n);return this.slerp(t,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,i=t._y,s=t._z,o=t._w,a=e._x,l=e._y,c=e._z,h=e._w;return this._x=n*h+o*a+i*c-s*l,this._y=i*h+o*l+s*a-n*c,this._z=s*h+o*c+n*l-i*a,this._w=o*h-n*a-i*l-s*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,i=this._y,s=this._z,o=this._w;let a=o*t._w+n*t._x+i*t._y+s*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=n,this._y=i,this._z=s,this;const l=1-a*a;if(l<=Number.EPSILON){const p=1-e;return this._w=p*o+e*this._w,this._x=p*n+e*this._x,this._y=p*i+e*this._y,this._z=p*s+e*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,a),d=Math.sin((1-e)*h)/c,u=Math.sin(e*h)/c;return this._w=o*d+this._w*u,this._x=n*d+this._x*u,this._y=i*d+this._y*u,this._z=s*d+this._z*u,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),s=Math.sqrt(n);return this.set(i*Math.sin(t),i*Math.cos(t),s*Math.sin(e),s*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}};class V{constructor(t=0,e=0,n=0){V.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(ja.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(ja.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,i=this.z,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6]*i,this.y=s[1]*e+s[4]*n+s[7]*i,this.z=s[2]*e+s[5]*n+s[8]*i,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,i=this.z,s=t.elements,o=1/(s[3]*e+s[7]*n+s[11]*i+s[15]);return this.x=(s[0]*e+s[4]*n+s[8]*i+s[12])*o,this.y=(s[1]*e+s[5]*n+s[9]*i+s[13])*o,this.z=(s[2]*e+s[6]*n+s[10]*i+s[14])*o,this}applyQuaternion(t){const e=this.x,n=this.y,i=this.z,s=t.x,o=t.y,a=t.z,l=t.w,c=2*(o*i-a*n),h=2*(a*e-s*i),d=2*(s*n-o*e);return this.x=e+l*c+o*d-a*h,this.y=n+l*h+a*c-s*d,this.z=i+l*d+s*h-o*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,i=this.z,s=t.elements;return this.x=s[0]*e+s[4]*n+s[8]*i,this.y=s[1]*e+s[5]*n+s[9]*i,this.z=s[2]*e+s[6]*n+s[10]*i,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Gt(this.x,t.x,e.x),this.y=Gt(this.y,t.y,e.y),this.z=Gt(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=Gt(this.x,t,e),this.y=Gt(this.y,t,e),this.z=Gt(this.z,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Gt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,i=t.y,s=t.z,o=e.x,a=e.y,l=e.z;return this.x=i*l-s*a,this.y=s*o-n*l,this.z=n*a-i*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Dr.copy(this).projectOnVector(t),this.sub(Dr)}reflect(t){return this.sub(Dr.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Gt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,i=this.z-t.z;return e*e+n*n+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const i=Math.sin(e)*t;return this.x=i*Math.sin(n),this.y=Math.cos(e)*t,this.z=i*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),i=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=i,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Dr=new V,ja=new Es;class zt{constructor(t,e,n,i,s,o,a,l,c){zt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,i,s,o,a,l,c)}set(t,e,n,i,s,o,a,l,c){const h=this.elements;return h[0]=t,h[1]=i,h[2]=a,h[3]=e,h[4]=s,h[5]=l,h[6]=n,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,i=e.elements,s=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],h=n[4],d=n[7],u=n[2],p=n[5],g=n[8],_=i[0],m=i[3],f=i[6],v=i[1],S=i[4],x=i[7],w=i[2],A=i[5],R=i[8];return s[0]=o*_+a*v+l*w,s[3]=o*m+a*S+l*A,s[6]=o*f+a*x+l*R,s[1]=c*_+h*v+d*w,s[4]=c*m+h*S+d*A,s[7]=c*f+h*x+d*R,s[2]=u*_+p*v+g*w,s[5]=u*m+p*S+g*A,s[8]=u*f+p*x+g*R,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],i=t[2],s=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8];return e*o*h-e*a*c-n*s*h+n*a*l+i*s*c-i*o*l}invert(){const t=this.elements,e=t[0],n=t[1],i=t[2],s=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],d=h*o-a*c,u=a*l-h*s,p=c*s-o*l,g=e*d+n*u+i*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return t[0]=d*_,t[1]=(i*c-h*n)*_,t[2]=(a*n-i*o)*_,t[3]=u*_,t[4]=(h*e-i*l)*_,t[5]=(i*s-a*e)*_,t[6]=p*_,t[7]=(n*l-c*e)*_,t[8]=(o*e-n*s)*_,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,i,s,o,a){const l=Math.cos(s),c=Math.sin(s);return this.set(n*l,n*c,-n*(l*o+c*a)+o+t,-i*c,i*l,-i*(-c*o+l*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(Nr.makeScale(t,e)),this}rotate(t){return this.premultiply(Nr.makeRotation(-t)),this}translate(t,e){return this.premultiply(Nr.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let i=0;i<9;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Nr=new zt;function Xl(r){for(let t=r.length-1;t>=0;--t)if(r[t]>=65535)return!0;return!1}function _r(r){return document.createElementNS("http://www.w3.org/1999/xhtml",r)}function Iu(){const r=_r("canvas");return r.style.display="block",r}const Ka={};function Vi(r){r in Ka||(Ka[r]=!0,console.warn(r))}function Lu(r,t,e){return new Promise(function(n,i){function s(){switch(r.clientWaitSync(t,r.SYNC_FLUSH_COMMANDS_BIT,0)){case r.WAIT_FAILED:i();break;case r.TIMEOUT_EXPIRED:setTimeout(s,e);break;default:n()}}setTimeout(s,e)})}const Ja=new zt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Qa=new zt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Du(){const r={enabled:!0,workingColorSpace:Yi,spaces:{},convert:function(i,s,o){return this.enabled===!1||s===o||!s||!o||(this.spaces[s].transfer===ne&&(i.r=Gn(i.r),i.g=Gn(i.g),i.b=Gn(i.b)),this.spaces[s].primaries!==this.spaces[o].primaries&&(i.applyMatrix3(this.spaces[s].toXYZ),i.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===ne&&(i.r=Gi(i.r),i.g=Gi(i.g),i.b=Gi(i.b))),i},workingToColorSpace:function(i,s){return this.convert(i,this.workingColorSpace,s)},colorSpaceToWorking:function(i,s){return this.convert(i,s,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===jn?mr:this.spaces[i].transfer},getLuminanceCoefficients:function(i,s=this.workingColorSpace){return i.fromArray(this.spaces[s].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,s,o){return i.copy(this.spaces[s].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(i,s){return Vi("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),r.workingToColorSpace(i,s)},toWorkingColorSpace:function(i,s){return Vi("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),r.colorSpaceToWorking(i,s)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return r.define({[Yi]:{primaries:t,whitePoint:n,transfer:mr,toXYZ:Ja,fromXYZ:Qa,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:je},outputColorSpaceConfig:{drawingBufferColorSpace:je}},[je]:{primaries:t,whitePoint:n,transfer:ne,toXYZ:Ja,fromXYZ:Qa,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:je}}}),r}const Yt=Du();function Gn(r){return r<.04045?r*.0773993808:Math.pow(r*.9478672986+.0521327014,2.4)}function Gi(r){return r<.0031308?r*12.92:1.055*Math.pow(r,.41666)-.055}let Si;class Nu{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{Si===void 0&&(Si=_r("canvas")),Si.width=t.width,Si.height=t.height;const i=Si.getContext("2d");t instanceof ImageData?i.putImageData(t,0,0):i.drawImage(t,0,0,t.width,t.height),n=Si}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=_r("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const i=n.getImageData(0,0,t.width,t.height),s=i.data;for(let o=0;o<s.length;o++)s[o]=Gn(s[o]/255)*255;return n.putImageData(i,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Gn(e[n]/255)*255):e[n]=Gn(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let Uu=0;class Sa{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Uu++}),this.uuid=Ss(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){const e=this.data;return e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):e instanceof VideoFrame?t.set(e.displayHeight,e.displayWidth,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let s;if(Array.isArray(i)){s=[];for(let o=0,a=i.length;o<a;o++)i[o].isDataTexture?s.push(Ur(i[o].image)):s.push(Ur(i[o]))}else s=Ur(i);n.url=s}return e||(t.images[this.uuid]=n),n}}function Ur(r){return typeof HTMLImageElement<"u"&&r instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&r instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&r instanceof ImageBitmap?Nu.getDataURL(r):r.data?{data:Array.from(r.data),width:r.width,height:r.height,type:r.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Fu=0;const Fr=new V;class We extends ji{constructor(t=We.DEFAULT_IMAGE,e=We.DEFAULT_MAPPING,n=gi,i=gi,s=Sn,o=_i,a=un,l=bn,c=We.DEFAULT_ANISOTROPY,h=jn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Fu++}),this.uuid=Ss(),this.name="",this.source=new Sa(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=s,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new Kt(0,0),this.repeat=new Kt(1,1),this.center=new Kt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new zt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Fr).x}get height(){return this.source.getSize(Fr).y}get depth(){return this.source.getSize(Fr).z}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${e}' has value of undefined.`);continue}const i=this[e];if(i===void 0){console.warn(`THREE.Texture.setValues(): property '${e}' does not exist.`);continue}i&&n&&i.isVector2&&n.isVector2||i&&n&&i.isVector3&&n.isVector3||i&&n&&i.isMatrix3&&n.isMatrix3?i.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Nl)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Fo:t.x=t.x-Math.floor(t.x);break;case gi:t.x=t.x<0?0:1;break;case Oo:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Fo:t.y=t.y-Math.floor(t.y);break;case gi:t.y=t.y<0?0:1;break;case Oo:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}We.DEFAULT_IMAGE=null;We.DEFAULT_MAPPING=Nl;We.DEFAULT_ANISOTROPY=1;class de{constructor(t=0,e=0,n=0,i=1){de.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=i}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,i){return this.x=t,this.y=e,this.z=n,this.w=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,i=this.z,s=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*i+o[12]*s,this.y=o[1]*e+o[5]*n+o[9]*i+o[13]*s,this.z=o[2]*e+o[6]*n+o[10]*i+o[14]*s,this.w=o[3]*e+o[7]*n+o[11]*i+o[15]*s,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,i,s;const l=t.elements,c=l[0],h=l[4],d=l[8],u=l[1],p=l[5],g=l[9],_=l[2],m=l[6],f=l[10];if(Math.abs(h-u)<.01&&Math.abs(d-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+u)<.1&&Math.abs(d+_)<.1&&Math.abs(g+m)<.1&&Math.abs(c+p+f-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const S=(c+1)/2,x=(p+1)/2,w=(f+1)/2,A=(h+u)/4,R=(d+_)/4,L=(g+m)/4;return S>x&&S>w?S<.01?(n=0,i=.707106781,s=.707106781):(n=Math.sqrt(S),i=A/n,s=R/n):x>w?x<.01?(n=.707106781,i=0,s=.707106781):(i=Math.sqrt(x),n=A/i,s=L/i):w<.01?(n=.707106781,i=.707106781,s=0):(s=Math.sqrt(w),n=R/s,i=L/s),this.set(n,i,s,e),this}let v=Math.sqrt((m-g)*(m-g)+(d-_)*(d-_)+(u-h)*(u-h));return Math.abs(v)<.001&&(v=1),this.x=(m-g)/v,this.y=(d-_)/v,this.z=(u-h)/v,this.w=Math.acos((c+p+f-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Gt(this.x,t.x,e.x),this.y=Gt(this.y,t.y,e.y),this.z=Gt(this.z,t.z,e.z),this.w=Gt(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=Gt(this.x,t,e),this.y=Gt(this.y,t,e),this.z=Gt(this.z,t,e),this.w=Gt(this.w,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Gt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Ou extends ji{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Sn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new de(0,0,t,e),this.scissorTest=!1,this.viewport=new de(0,0,t,e);const i={width:t,height:e,depth:n.depth},s=new We(i);this.textures=[];const o=n.count;for(let a=0;a<o;a++)this.textures[a]=s.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(t={}){const e={minFilter:Sn,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let i=0,s=this.textures.length;i<s;i++)this.textures[i].image.width=t,this.textures[i].image.height=e,this.textures[i].image.depth=n,this.textures[i].isArrayTexture=this.textures[i].image.depth>1;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;const i=Object.assign({},t.textures[e].image);this.textures[e].source=new Sa(i)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class xi extends Ou{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class ql extends We{constructor(t=null,e=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=fn,this.minFilter=fn,this.wrapR=gi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class zu extends We{constructor(t=null,e=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=fn,this.minFilter=fn,this.wrapR=gi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Ts{constructor(t=new V(1/0,1/0,1/0),e=new V(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(an.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(an.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=an.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const s=n.getAttribute("position");if(e===!0&&s!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=s.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,an):an.fromBufferAttribute(s,o),an.applyMatrix4(t.matrixWorld),this.expandByPoint(an);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Ps.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Ps.copy(n.boundingBox)),Ps.applyMatrix4(t.matrixWorld),this.union(Ps)}const i=t.children;for(let s=0,o=i.length;s<o;s++)this.expandByObject(i[s],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,an),an.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(es),Is.subVectors(this.max,es),Ei.subVectors(t.a,es),Ti.subVectors(t.b,es),bi.subVectors(t.c,es),Hn.subVectors(Ti,Ei),Wn.subVectors(bi,Ti),ii.subVectors(Ei,bi);let e=[0,-Hn.z,Hn.y,0,-Wn.z,Wn.y,0,-ii.z,ii.y,Hn.z,0,-Hn.x,Wn.z,0,-Wn.x,ii.z,0,-ii.x,-Hn.y,Hn.x,0,-Wn.y,Wn.x,0,-ii.y,ii.x,0];return!Or(e,Ei,Ti,bi,Is)||(e=[1,0,0,0,1,0,0,0,1],!Or(e,Ei,Ti,bi,Is))?!1:(Ls.crossVectors(Hn,Wn),e=[Ls.x,Ls.y,Ls.z],Or(e,Ei,Ti,bi,Is))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,an).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(an).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Rn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Rn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Rn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Rn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Rn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Rn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Rn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Rn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Rn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}}const Rn=[new V,new V,new V,new V,new V,new V,new V,new V],an=new V,Ps=new Ts,Ei=new V,Ti=new V,bi=new V,Hn=new V,Wn=new V,ii=new V,es=new V,Is=new V,Ls=new V,si=new V;function Or(r,t,e,n,i){for(let s=0,o=r.length-3;s<=o;s+=3){si.fromArray(r,s);const a=i.x*Math.abs(si.x)+i.y*Math.abs(si.y)+i.z*Math.abs(si.z),l=t.dot(si),c=e.dot(si),h=n.dot(si);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}const Bu=new Ts,ns=new V,zr=new V;let br=class{constructor(t=new V,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):Bu.setFromPoints(t).getCenter(n);let i=0;for(let s=0,o=t.length;s<o;s++)i=Math.max(i,n.distanceToSquared(t[s]));return this.radius=Math.sqrt(i),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;ns.subVectors(t,this.center);const e=ns.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),i=(n-this.radius)*.5;this.center.addScaledVector(ns,i/n),this.radius+=i}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(zr.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(ns.copy(t.center).add(zr)),this.expandByPoint(ns.copy(t.center).sub(zr))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}};const Cn=new V,Br=new V,Ds=new V,Xn=new V,kr=new V,Ns=new V,Vr=new V;let Yl=class{constructor(t=new V,e=new V(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Cn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Cn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Cn.copy(this.origin).addScaledVector(this.direction,e),Cn.distanceToSquared(t))}distanceSqToSegment(t,e,n,i){Br.copy(t).add(e).multiplyScalar(.5),Ds.copy(e).sub(t).normalize(),Xn.copy(this.origin).sub(Br);const s=t.distanceTo(e)*.5,o=-this.direction.dot(Ds),a=Xn.dot(this.direction),l=-Xn.dot(Ds),c=Xn.lengthSq(),h=Math.abs(1-o*o);let d,u,p,g;if(h>0)if(d=o*l-a,u=o*a-l,g=s*h,d>=0)if(u>=-g)if(u<=g){const _=1/h;d*=_,u*=_,p=d*(d+o*u+2*a)+u*(o*d+u+2*l)+c}else u=s,d=Math.max(0,-(o*u+a)),p=-d*d+u*(u+2*l)+c;else u=-s,d=Math.max(0,-(o*u+a)),p=-d*d+u*(u+2*l)+c;else u<=-g?(d=Math.max(0,-(-o*s+a)),u=d>0?-s:Math.min(Math.max(-s,-l),s),p=-d*d+u*(u+2*l)+c):u<=g?(d=0,u=Math.min(Math.max(-s,-l),s),p=u*(u+2*l)+c):(d=Math.max(0,-(o*s+a)),u=d>0?s:Math.min(Math.max(-s,-l),s),p=-d*d+u*(u+2*l)+c);else u=o>0?-s:s,d=Math.max(0,-(o*u+a)),p=-d*d+u*(u+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,d),i&&i.copy(Br).addScaledVector(Ds,u),p}intersectSphere(t,e){Cn.subVectors(t.center,this.origin);const n=Cn.dot(this.direction),i=Cn.dot(Cn)-n*n,s=t.radius*t.radius;if(i>s)return null;const o=Math.sqrt(s-i),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,e):this.at(a,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,i,s,o,a,l;const c=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,u=this.origin;return c>=0?(n=(t.min.x-u.x)*c,i=(t.max.x-u.x)*c):(n=(t.max.x-u.x)*c,i=(t.min.x-u.x)*c),h>=0?(s=(t.min.y-u.y)*h,o=(t.max.y-u.y)*h):(s=(t.max.y-u.y)*h,o=(t.min.y-u.y)*h),n>o||s>i||((s>n||isNaN(n))&&(n=s),(o<i||isNaN(i))&&(i=o),d>=0?(a=(t.min.z-u.z)*d,l=(t.max.z-u.z)*d):(a=(t.max.z-u.z)*d,l=(t.min.z-u.z)*d),n>l||a>i)||((a>n||n!==n)&&(n=a),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,e)}intersectsBox(t){return this.intersectBox(t,Cn)!==null}intersectTriangle(t,e,n,i,s){kr.subVectors(e,t),Ns.subVectors(n,t),Vr.crossVectors(kr,Ns);let o=this.direction.dot(Vr),a;if(o>0){if(i)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Xn.subVectors(this.origin,t);const l=a*this.direction.dot(Ns.crossVectors(Xn,Ns));if(l<0)return null;const c=a*this.direction.dot(kr.cross(Xn));if(c<0||l+c>o)return null;const h=-a*Xn.dot(Vr);return h<0?null:this.at(h/o,s)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}};class fe{constructor(t,e,n,i,s,o,a,l,c,h,d,u,p,g,_,m){fe.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,i,s,o,a,l,c,h,d,u,p,g,_,m)}set(t,e,n,i,s,o,a,l,c,h,d,u,p,g,_,m){const f=this.elements;return f[0]=t,f[4]=e,f[8]=n,f[12]=i,f[1]=s,f[5]=o,f[9]=a,f[13]=l,f[2]=c,f[6]=h,f[10]=d,f[14]=u,f[3]=p,f[7]=g,f[11]=_,f[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new fe().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,i=1/wi.setFromMatrixColumn(t,0).length(),s=1/wi.setFromMatrixColumn(t,1).length(),o=1/wi.setFromMatrixColumn(t,2).length();return e[0]=n[0]*i,e[1]=n[1]*i,e[2]=n[2]*i,e[3]=0,e[4]=n[4]*s,e[5]=n[5]*s,e[6]=n[6]*s,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,i=t.y,s=t.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(i),c=Math.sin(i),h=Math.cos(s),d=Math.sin(s);if(t.order==="XYZ"){const u=o*h,p=o*d,g=a*h,_=a*d;e[0]=l*h,e[4]=-l*d,e[8]=c,e[1]=p+g*c,e[5]=u-_*c,e[9]=-a*l,e[2]=_-u*c,e[6]=g+p*c,e[10]=o*l}else if(t.order==="YXZ"){const u=l*h,p=l*d,g=c*h,_=c*d;e[0]=u+_*a,e[4]=g*a-p,e[8]=o*c,e[1]=o*d,e[5]=o*h,e[9]=-a,e[2]=p*a-g,e[6]=_+u*a,e[10]=o*l}else if(t.order==="ZXY"){const u=l*h,p=l*d,g=c*h,_=c*d;e[0]=u-_*a,e[4]=-o*d,e[8]=g+p*a,e[1]=p+g*a,e[5]=o*h,e[9]=_-u*a,e[2]=-o*c,e[6]=a,e[10]=o*l}else if(t.order==="ZYX"){const u=o*h,p=o*d,g=a*h,_=a*d;e[0]=l*h,e[4]=g*c-p,e[8]=u*c+_,e[1]=l*d,e[5]=_*c+u,e[9]=p*c-g,e[2]=-c,e[6]=a*l,e[10]=o*l}else if(t.order==="YZX"){const u=o*l,p=o*c,g=a*l,_=a*c;e[0]=l*h,e[4]=_-u*d,e[8]=g*d+p,e[1]=d,e[5]=o*h,e[9]=-a*h,e[2]=-c*h,e[6]=p*d+g,e[10]=u-_*d}else if(t.order==="XZY"){const u=o*l,p=o*c,g=a*l,_=a*c;e[0]=l*h,e[4]=-d,e[8]=c*h,e[1]=u*d+_,e[5]=o*h,e[9]=p*d-g,e[2]=g*d-p,e[6]=a*h,e[10]=_*d+u}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(ku,t,Vu)}lookAt(t,e,n){const i=this.elements;return Ye.subVectors(t,e),Ye.lengthSq()===0&&(Ye.z=1),Ye.normalize(),qn.crossVectors(n,Ye),qn.lengthSq()===0&&(Math.abs(n.z)===1?Ye.x+=1e-4:Ye.z+=1e-4,Ye.normalize(),qn.crossVectors(n,Ye)),qn.normalize(),Us.crossVectors(Ye,qn),i[0]=qn.x,i[4]=Us.x,i[8]=Ye.x,i[1]=qn.y,i[5]=Us.y,i[9]=Ye.y,i[2]=qn.z,i[6]=Us.z,i[10]=Ye.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,i=e.elements,s=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],h=n[1],d=n[5],u=n[9],p=n[13],g=n[2],_=n[6],m=n[10],f=n[14],v=n[3],S=n[7],x=n[11],w=n[15],A=i[0],R=i[4],L=i[8],b=i[12],E=i[1],P=i[5],H=i[9],I=i[13],F=i[2],O=i[6],N=i[10],$=i[14],k=i[3],K=i[7],ot=i[11],pt=i[15];return s[0]=o*A+a*E+l*F+c*k,s[4]=o*R+a*P+l*O+c*K,s[8]=o*L+a*H+l*N+c*ot,s[12]=o*b+a*I+l*$+c*pt,s[1]=h*A+d*E+u*F+p*k,s[5]=h*R+d*P+u*O+p*K,s[9]=h*L+d*H+u*N+p*ot,s[13]=h*b+d*I+u*$+p*pt,s[2]=g*A+_*E+m*F+f*k,s[6]=g*R+_*P+m*O+f*K,s[10]=g*L+_*H+m*N+f*ot,s[14]=g*b+_*I+m*$+f*pt,s[3]=v*A+S*E+x*F+w*k,s[7]=v*R+S*P+x*O+w*K,s[11]=v*L+S*H+x*N+w*ot,s[15]=v*b+S*I+x*$+w*pt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],i=t[8],s=t[12],o=t[1],a=t[5],l=t[9],c=t[13],h=t[2],d=t[6],u=t[10],p=t[14],g=t[3],_=t[7],m=t[11],f=t[15];return g*(+s*l*d-i*c*d-s*a*u+n*c*u+i*a*p-n*l*p)+_*(+e*l*p-e*c*u+s*o*u-i*o*p+i*c*h-s*l*h)+m*(+e*c*d-e*a*p-s*o*d+n*o*p+s*a*h-n*c*h)+f*(-i*a*h-e*l*d+e*a*u+i*o*d-n*o*u+n*l*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const i=this.elements;return t.isVector3?(i[12]=t.x,i[13]=t.y,i[14]=t.z):(i[12]=t,i[13]=e,i[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],i=t[2],s=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],d=t[9],u=t[10],p=t[11],g=t[12],_=t[13],m=t[14],f=t[15],v=d*m*c-_*u*c+_*l*p-a*m*p-d*l*f+a*u*f,S=g*u*c-h*m*c-g*l*p+o*m*p+h*l*f-o*u*f,x=h*_*c-g*d*c+g*a*p-o*_*p-h*a*f+o*d*f,w=g*d*l-h*_*l-g*a*u+o*_*u+h*a*m-o*d*m,A=e*v+n*S+i*x+s*w;if(A===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const R=1/A;return t[0]=v*R,t[1]=(_*u*s-d*m*s-_*i*p+n*m*p+d*i*f-n*u*f)*R,t[2]=(a*m*s-_*l*s+_*i*c-n*m*c-a*i*f+n*l*f)*R,t[3]=(d*l*s-a*u*s-d*i*c+n*u*c+a*i*p-n*l*p)*R,t[4]=S*R,t[5]=(h*m*s-g*u*s+g*i*p-e*m*p-h*i*f+e*u*f)*R,t[6]=(g*l*s-o*m*s-g*i*c+e*m*c+o*i*f-e*l*f)*R,t[7]=(o*u*s-h*l*s+h*i*c-e*u*c-o*i*p+e*l*p)*R,t[8]=x*R,t[9]=(g*d*s-h*_*s-g*n*p+e*_*p+h*n*f-e*d*f)*R,t[10]=(o*_*s-g*a*s+g*n*c-e*_*c-o*n*f+e*a*f)*R,t[11]=(h*a*s-o*d*s-h*n*c+e*d*c+o*n*p-e*a*p)*R,t[12]=w*R,t[13]=(h*_*i-g*d*i+g*n*u-e*_*u-h*n*m+e*d*m)*R,t[14]=(g*a*i-o*_*i-g*n*l+e*_*l+o*n*m-e*a*m)*R,t[15]=(o*d*i-h*a*i+h*n*l-e*d*l-o*n*u+e*a*u)*R,this}scale(t){const e=this.elements,n=t.x,i=t.y,s=t.z;return e[0]*=n,e[4]*=i,e[8]*=s,e[1]*=n,e[5]*=i,e[9]*=s,e[2]*=n,e[6]*=i,e[10]*=s,e[3]*=n,e[7]*=i,e[11]*=s,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],i=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,i))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),i=Math.sin(e),s=1-n,o=t.x,a=t.y,l=t.z,c=s*o,h=s*a;return this.set(c*o+n,c*a-i*l,c*l+i*a,0,c*a+i*l,h*a+n,h*l-i*o,0,c*l-i*a,h*l+i*o,s*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,i,s,o){return this.set(1,n,s,0,t,1,o,0,e,i,1,0,0,0,0,1),this}compose(t,e,n){const i=this.elements,s=e._x,o=e._y,a=e._z,l=e._w,c=s+s,h=o+o,d=a+a,u=s*c,p=s*h,g=s*d,_=o*h,m=o*d,f=a*d,v=l*c,S=l*h,x=l*d,w=n.x,A=n.y,R=n.z;return i[0]=(1-(_+f))*w,i[1]=(p+x)*w,i[2]=(g-S)*w,i[3]=0,i[4]=(p-x)*A,i[5]=(1-(u+f))*A,i[6]=(m+v)*A,i[7]=0,i[8]=(g+S)*R,i[9]=(m-v)*R,i[10]=(1-(u+_))*R,i[11]=0,i[12]=t.x,i[13]=t.y,i[14]=t.z,i[15]=1,this}decompose(t,e,n){const i=this.elements;let s=wi.set(i[0],i[1],i[2]).length();const o=wi.set(i[4],i[5],i[6]).length(),a=wi.set(i[8],i[9],i[10]).length();this.determinant()<0&&(s=-s),t.x=i[12],t.y=i[13],t.z=i[14],cn.copy(this);const c=1/s,h=1/o,d=1/a;return cn.elements[0]*=c,cn.elements[1]*=c,cn.elements[2]*=c,cn.elements[4]*=h,cn.elements[5]*=h,cn.elements[6]*=h,cn.elements[8]*=d,cn.elements[9]*=d,cn.elements[10]*=d,e.setFromRotationMatrix(cn),n.x=s,n.y=o,n.z=a,this}makePerspective(t,e,n,i,s,o,a=En,l=!1){const c=this.elements,h=2*s/(e-t),d=2*s/(n-i),u=(e+t)/(e-t),p=(n+i)/(n-i);let g,_;if(l)g=s/(o-s),_=o*s/(o-s);else if(a===En)g=-(o+s)/(o-s),_=-2*o*s/(o-s);else if(a===gr)g=-o/(o-s),_=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=d,c[9]=p,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=_,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,i,s,o,a=En,l=!1){const c=this.elements,h=2/(e-t),d=2/(n-i),u=-(e+t)/(e-t),p=-(n+i)/(n-i);let g,_;if(l)g=1/(o-s),_=o/(o-s);else if(a===En)g=-2/(o-s),_=-(o+s)/(o-s);else if(a===gr)g=-1/(o-s),_=-s/(o-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=0,c[12]=u,c[1]=0,c[5]=d,c[9]=0,c[13]=p,c[2]=0,c[6]=0,c[10]=g,c[14]=_,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let i=0;i<16;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const wi=new V,cn=new fe,ku=new V(0,0,0),Vu=new V(1,1,1),qn=new V,Us=new V,Ye=new V,tc=new fe,ec=new Es;class wn{constructor(t=0,e=0,n=0,i=wn.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=i}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,i=this._order){return this._x=t,this._y=e,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const i=t.elements,s=i[0],o=i[4],a=i[8],l=i[1],c=i[5],h=i[9],d=i[2],u=i[6],p=i[10];switch(e){case"XYZ":this._y=Math.asin(Gt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,p),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(u,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Gt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,s),this._z=0);break;case"ZXY":this._x=Math.asin(Gt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-d,p),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-Gt(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(u,p),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(Gt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-d,s)):(this._x=0,this._y=Math.atan2(a,p));break;case"XZY":this._z=Math.asin(-Gt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(u,c),this._y=Math.atan2(a,s)):(this._x=Math.atan2(-h,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return tc.makeRotationFromQuaternion(t),this.setFromRotationMatrix(tc,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return ec.setFromEuler(this),this.setFromQuaternion(ec,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}wn.DEFAULT_ORDER="XYZ";class $l{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Gu=0;const nc=new V,Ai=new Es,Pn=new fe,Fs=new V,is=new V,Hu=new V,Wu=new Es,ic=new V(1,0,0),sc=new V(0,1,0),rc=new V(0,0,1),oc={type:"added"},Xu={type:"removed"},Ri={type:"childadded",child:null},Gr={type:"childremoved",child:null};class we extends ji{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Gu++}),this.uuid=Ss(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=we.DEFAULT_UP.clone();const t=new V,e=new wn,n=new Es,i=new V(1,1,1);function s(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(s),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new fe},normalMatrix:{value:new zt}}),this.matrix=new fe,this.matrixWorld=new fe,this.matrixAutoUpdate=we.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=we.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new $l,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Ai.setFromAxisAngle(t,e),this.quaternion.multiply(Ai),this}rotateOnWorldAxis(t,e){return Ai.setFromAxisAngle(t,e),this.quaternion.premultiply(Ai),this}rotateX(t){return this.rotateOnAxis(ic,t)}rotateY(t){return this.rotateOnAxis(sc,t)}rotateZ(t){return this.rotateOnAxis(rc,t)}translateOnAxis(t,e){return nc.copy(t).applyQuaternion(this.quaternion),this.position.add(nc.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(ic,t)}translateY(t){return this.translateOnAxis(sc,t)}translateZ(t){return this.translateOnAxis(rc,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Pn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Fs.copy(t):Fs.set(t,e,n);const i=this.parent;this.updateWorldMatrix(!0,!1),is.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Pn.lookAt(is,Fs,this.up):Pn.lookAt(Fs,is,this.up),this.quaternion.setFromRotationMatrix(Pn),i&&(Pn.extractRotation(i.matrixWorld),Ai.setFromRotationMatrix(Pn),this.quaternion.premultiply(Ai.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(oc),Ri.child=t,this.dispatchEvent(Ri),Ri.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Xu),Gr.child=t,this.dispatchEvent(Gr),Gr.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Pn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Pn.multiply(t.parent.matrixWorld)),t.applyMatrix4(Pn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(oc),Ri.child=t,this.dispatchEvent(Ri),Ri.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,i=this.children.length;n<i;n++){const o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const i=this.children;for(let s=0,o=i.length;s<o;s++)i[s].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(is,t,Hu),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(is,Wu,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const i=this.children;for(let s=0,o=i.length;s<o;s++)i[s].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),i.instanceInfo=this._instanceInfo.map(a=>({...a})),i.availableInstanceIds=this._availableInstanceIds.slice(),i.availableGeometryIds=this._availableGeometryIds.slice(),i.nextIndexStart=this._nextIndexStart,i.nextVertexStart=this._nextVertexStart,i.geometryCount=this._geometryCount,i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.matricesTexture=this._matricesTexture.toJSON(t),i.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(i.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(i.boundingBox=this.boundingBox.toJSON()));function s(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=s(t.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const d=l[c];s(t.shapes,d)}else s(t.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(t.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(s(t.materials,this.material[l]));i.material=a}else i.material=s(t.materials,this.material);if(this.children.length>0){i.children=[];for(let a=0;a<this.children.length;a++)i.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){i.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];i.animations.push(s(t.animations,l))}}if(e){const a=o(t.geometries),l=o(t.materials),c=o(t.textures),h=o(t.images),d=o(t.shapes),u=o(t.skeletons),p=o(t.animations),g=o(t.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),d.length>0&&(n.shapes=d),u.length>0&&(n.skeletons=u),p.length>0&&(n.animations=p),g.length>0&&(n.nodes=g)}return n.object=i,n;function o(a){const l=[];for(const c in a){const h=a[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const i=t.children[n];this.add(i.clone())}return this}}we.DEFAULT_UP=new V(0,1,0);we.DEFAULT_MATRIX_AUTO_UPDATE=!0;we.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const ln=new V,In=new V,Hr=new V,Ln=new V,Ci=new V,Pi=new V,ac=new V,Wr=new V,Xr=new V,qr=new V,Yr=new de,$r=new de,Zr=new de;class rn{constructor(t=new V,e=new V,n=new V){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,i){i.subVectors(n,e),ln.subVectors(t,e),i.cross(ln);const s=i.lengthSq();return s>0?i.multiplyScalar(1/Math.sqrt(s)):i.set(0,0,0)}static getBarycoord(t,e,n,i,s){ln.subVectors(i,e),In.subVectors(n,e),Hr.subVectors(t,e);const o=ln.dot(ln),a=ln.dot(In),l=ln.dot(Hr),c=In.dot(In),h=In.dot(Hr),d=o*c-a*a;if(d===0)return s.set(0,0,0),null;const u=1/d,p=(c*l-a*h)*u,g=(o*h-a*l)*u;return s.set(1-p-g,g,p)}static containsPoint(t,e,n,i){return this.getBarycoord(t,e,n,i,Ln)===null?!1:Ln.x>=0&&Ln.y>=0&&Ln.x+Ln.y<=1}static getInterpolation(t,e,n,i,s,o,a,l){return this.getBarycoord(t,e,n,i,Ln)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,Ln.x),l.addScaledVector(o,Ln.y),l.addScaledVector(a,Ln.z),l)}static getInterpolatedAttribute(t,e,n,i,s,o){return Yr.setScalar(0),$r.setScalar(0),Zr.setScalar(0),Yr.fromBufferAttribute(t,e),$r.fromBufferAttribute(t,n),Zr.fromBufferAttribute(t,i),o.setScalar(0),o.addScaledVector(Yr,s.x),o.addScaledVector($r,s.y),o.addScaledVector(Zr,s.z),o}static isFrontFacing(t,e,n,i){return ln.subVectors(n,e),In.subVectors(t,e),ln.cross(In).dot(i)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,i){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[i]),this}setFromAttributeAndIndices(t,e,n,i){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,i),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return ln.subVectors(this.c,this.b),In.subVectors(this.a,this.b),ln.cross(In).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return rn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return rn.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,i,s){return rn.getInterpolation(t,this.a,this.b,this.c,e,n,i,s)}containsPoint(t){return rn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return rn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,i=this.b,s=this.c;let o,a;Ci.subVectors(i,n),Pi.subVectors(s,n),Wr.subVectors(t,n);const l=Ci.dot(Wr),c=Pi.dot(Wr);if(l<=0&&c<=0)return e.copy(n);Xr.subVectors(t,i);const h=Ci.dot(Xr),d=Pi.dot(Xr);if(h>=0&&d<=h)return e.copy(i);const u=l*d-h*c;if(u<=0&&l>=0&&h<=0)return o=l/(l-h),e.copy(n).addScaledVector(Ci,o);qr.subVectors(t,s);const p=Ci.dot(qr),g=Pi.dot(qr);if(g>=0&&p<=g)return e.copy(s);const _=p*c-l*g;if(_<=0&&c>=0&&g<=0)return a=c/(c-g),e.copy(n).addScaledVector(Pi,a);const m=h*g-p*d;if(m<=0&&d-h>=0&&p-g>=0)return ac.subVectors(s,i),a=(d-h)/(d-h+(p-g)),e.copy(i).addScaledVector(ac,a);const f=1/(m+_+u);return o=_*f,a=u*f,e.copy(n).addScaledVector(Ci,o).addScaledVector(Pi,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const Zl={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Yn={h:0,s:0,l:0},Os={h:0,s:0,l:0};function jr(r,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?r+(t-r)*6*e:e<1/2?t:e<2/3?r+(t-r)*6*(2/3-e):r}class Ht{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const i=t;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=je){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Yt.colorSpaceToWorking(this,e),this}setRGB(t,e,n,i=Yt.workingColorSpace){return this.r=t,this.g=e,this.b=n,Yt.colorSpaceToWorking(this,i),this}setHSL(t,e,n,i=Yt.workingColorSpace){if(t=Pu(t,1),e=Gt(e,0,1),n=Gt(n,0,1),e===0)this.r=this.g=this.b=n;else{const s=n<=.5?n*(1+e):n+e-n*e,o=2*n-s;this.r=jr(o,s,t+1/3),this.g=jr(o,s,t),this.b=jr(o,s,t-1/3)}return Yt.colorSpaceToWorking(this,i),this}setStyle(t,e=je){function n(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(t)){let s;const o=i[1],a=i[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,e);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,e);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(t)){const s=i[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(s,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=je){const n=Zl[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Gn(t.r),this.g=Gn(t.g),this.b=Gn(t.b),this}copyLinearToSRGB(t){return this.r=Gi(t.r),this.g=Gi(t.g),this.b=Gi(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=je){return Yt.workingToColorSpace(Ce.copy(this),t),Math.round(Gt(Ce.r*255,0,255))*65536+Math.round(Gt(Ce.g*255,0,255))*256+Math.round(Gt(Ce.b*255,0,255))}getHexString(t=je){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Yt.workingColorSpace){Yt.workingToColorSpace(Ce.copy(this),e);const n=Ce.r,i=Ce.g,s=Ce.b,o=Math.max(n,i,s),a=Math.min(n,i,s);let l,c;const h=(a+o)/2;if(a===o)l=0,c=0;else{const d=o-a;switch(c=h<=.5?d/(o+a):d/(2-o-a),o){case n:l=(i-s)/d+(i<s?6:0);break;case i:l=(s-n)/d+2;break;case s:l=(n-i)/d+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=Yt.workingColorSpace){return Yt.workingToColorSpace(Ce.copy(this),e),t.r=Ce.r,t.g=Ce.g,t.b=Ce.b,t}getStyle(t=je){Yt.workingToColorSpace(Ce.copy(this),t);const e=Ce.r,n=Ce.g,i=Ce.b;return t!==je?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(t,e,n){return this.getHSL(Yn),this.setHSL(Yn.h+t,Yn.s+e,Yn.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Yn),t.getHSL(Os);const n=Lr(Yn.h,Os.h,e),i=Lr(Yn.s,Os.s,e),s=Lr(Yn.l,Os.l,e);return this.setHSL(n,i,s),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,i=this.b,s=t.elements;return this.r=s[0]*e+s[3]*n+s[6]*i,this.g=s[1]*e+s[4]*n+s[7]*i,this.b=s[2]*e+s[5]*n+s[8]*i,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Ce=new Ht;Ht.NAMES=Zl;let qu=0,Ki=class extends ji{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:qu++}),this.uuid=Ss(),this.name="",this.type="Material",this.blending=ki,this.side=Qn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=bo,this.blendDst=wo,this.blendEquation=fi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ht(0,0,0),this.blendAlpha=0,this.depthFunc=Wi,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Ya,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Mi,this.stencilZFail=Mi,this.stencilZPass=Mi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const i=this[e];if(i===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==ki&&(n.blending=this.blending),this.side!==Qn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==bo&&(n.blendSrc=this.blendSrc),this.blendDst!==wo&&(n.blendDst=this.blendDst),this.blendEquation!==fi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Wi&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Ya&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Mi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Mi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Mi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(s){const o=[];for(const a in s){const l=s[a];delete l.metadata,o.push(l)}return o}if(e){const s=i(t.textures),o=i(t.images);s.length>0&&(n.textures=s),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const i=e.length;n=new Array(i);for(let s=0;s!==i;++s)n[s]=e[s].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}};class Oi extends Ki{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ht(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new wn,this.combine=Dl,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const ge=new V,zs=new Kt;let Yu=0;class Tn{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Yu++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=$a,this.updateRanges=[],this.gpuType=kn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let i=0,s=this.itemSize;i<s;i++)this.array[t+i]=e.array[n+i];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)zs.fromBufferAttribute(this,e),zs.applyMatrix3(t),this.setXY(e,zs.x,zs.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)ge.fromBufferAttribute(this,e),ge.applyMatrix3(t),this.setXYZ(e,ge.x,ge.y,ge.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)ge.fromBufferAttribute(this,e),ge.applyMatrix4(t),this.setXYZ(e,ge.x,ge.y,ge.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)ge.fromBufferAttribute(this,e),ge.applyNormalMatrix(t),this.setXYZ(e,ge.x,ge.y,ge.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)ge.fromBufferAttribute(this,e),ge.transformDirection(t),this.setXYZ(e,ge.x,ge.y,ge.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=ts(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Ve(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=ts(e,this.array)),e}setX(t,e){return this.normalized&&(e=Ve(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=ts(e,this.array)),e}setY(t,e){return this.normalized&&(e=Ve(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=ts(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Ve(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=ts(e,this.array)),e}setW(t,e){return this.normalized&&(e=Ve(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=Ve(e,this.array),n=Ve(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,i){return t*=this.itemSize,this.normalized&&(e=Ve(e,this.array),n=Ve(n,this.array),i=Ve(i,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this}setXYZW(t,e,n,i,s){return t*=this.itemSize,this.normalized&&(e=Ve(e,this.array),n=Ve(n,this.array),i=Ve(i,this.array),s=Ve(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this.array[t+3]=s,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==$a&&(t.usage=this.usage),t}}class jl extends Tn{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class Kl extends Tn{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class Le extends Tn{constructor(t,e,n){super(new Float32Array(t),e,n)}}let $u=0;const tn=new fe,Kr=new we,Ii=new V,$e=new Ts,ss=new Ts,be=new V;class on extends ji{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:$u++}),this.uuid=Ss(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Xl(t)?Kl:jl)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const s=new zt().getNormalMatrix(t);n.applyNormalMatrix(s),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(t),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return tn.makeRotationFromQuaternion(t),this.applyMatrix4(tn),this}rotateX(t){return tn.makeRotationX(t),this.applyMatrix4(tn),this}rotateY(t){return tn.makeRotationY(t),this.applyMatrix4(tn),this}rotateZ(t){return tn.makeRotationZ(t),this.applyMatrix4(tn),this}translate(t,e,n){return tn.makeTranslation(t,e,n),this.applyMatrix4(tn),this}scale(t,e,n){return tn.makeScale(t,e,n),this.applyMatrix4(tn),this}lookAt(t){return Kr.lookAt(t),Kr.updateMatrix(),this.applyMatrix4(Kr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ii).negate(),this.translate(Ii.x,Ii.y,Ii.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let i=0,s=t.length;i<s;i++){const o=t[i];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Le(n,3))}else{const n=Math.min(t.length,e.count);for(let i=0;i<n;i++){const s=t[i];e.setXYZ(i,s.x,s.y,s.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ts);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new V(-1/0,-1/0,-1/0),new V(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,i=e.length;n<i;n++){const s=e[n];$e.setFromBufferAttribute(s),this.morphTargetsRelative?(be.addVectors(this.boundingBox.min,$e.min),this.boundingBox.expandByPoint(be),be.addVectors(this.boundingBox.max,$e.max),this.boundingBox.expandByPoint(be)):(this.boundingBox.expandByPoint($e.min),this.boundingBox.expandByPoint($e.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new br);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new V,1/0);return}if(t){const n=this.boundingSphere.center;if($e.setFromBufferAttribute(t),e)for(let s=0,o=e.length;s<o;s++){const a=e[s];ss.setFromBufferAttribute(a),this.morphTargetsRelative?(be.addVectors($e.min,ss.min),$e.expandByPoint(be),be.addVectors($e.max,ss.max),$e.expandByPoint(be)):($e.expandByPoint(ss.min),$e.expandByPoint(ss.max))}$e.getCenter(n);let i=0;for(let s=0,o=t.count;s<o;s++)be.fromBufferAttribute(t,s),i=Math.max(i,n.distanceToSquared(be));if(e)for(let s=0,o=e.length;s<o;s++){const a=e[s],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)be.fromBufferAttribute(a,c),l&&(Ii.fromBufferAttribute(t,c),be.add(Ii)),i=Math.max(i,n.distanceToSquared(be))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,i=e.normal,s=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Tn(new Float32Array(4*n.count),4));const o=this.getAttribute("tangent"),a=[],l=[];for(let L=0;L<n.count;L++)a[L]=new V,l[L]=new V;const c=new V,h=new V,d=new V,u=new Kt,p=new Kt,g=new Kt,_=new V,m=new V;function f(L,b,E){c.fromBufferAttribute(n,L),h.fromBufferAttribute(n,b),d.fromBufferAttribute(n,E),u.fromBufferAttribute(s,L),p.fromBufferAttribute(s,b),g.fromBufferAttribute(s,E),h.sub(c),d.sub(c),p.sub(u),g.sub(u);const P=1/(p.x*g.y-g.x*p.y);isFinite(P)&&(_.copy(h).multiplyScalar(g.y).addScaledVector(d,-p.y).multiplyScalar(P),m.copy(d).multiplyScalar(p.x).addScaledVector(h,-g.x).multiplyScalar(P),a[L].add(_),a[b].add(_),a[E].add(_),l[L].add(m),l[b].add(m),l[E].add(m))}let v=this.groups;v.length===0&&(v=[{start:0,count:t.count}]);for(let L=0,b=v.length;L<b;++L){const E=v[L],P=E.start,H=E.count;for(let I=P,F=P+H;I<F;I+=3)f(t.getX(I+0),t.getX(I+1),t.getX(I+2))}const S=new V,x=new V,w=new V,A=new V;function R(L){w.fromBufferAttribute(i,L),A.copy(w);const b=a[L];S.copy(b),S.sub(w.multiplyScalar(w.dot(b))).normalize(),x.crossVectors(A,b);const P=x.dot(l[L])<0?-1:1;o.setXYZW(L,S.x,S.y,S.z,P)}for(let L=0,b=v.length;L<b;++L){const E=v[L],P=E.start,H=E.count;for(let I=P,F=P+H;I<F;I+=3)R(t.getX(I+0)),R(t.getX(I+1)),R(t.getX(I+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Tn(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let u=0,p=n.count;u<p;u++)n.setXYZ(u,0,0,0);const i=new V,s=new V,o=new V,a=new V,l=new V,c=new V,h=new V,d=new V;if(t)for(let u=0,p=t.count;u<p;u+=3){const g=t.getX(u+0),_=t.getX(u+1),m=t.getX(u+2);i.fromBufferAttribute(e,g),s.fromBufferAttribute(e,_),o.fromBufferAttribute(e,m),h.subVectors(o,s),d.subVectors(i,s),h.cross(d),a.fromBufferAttribute(n,g),l.fromBufferAttribute(n,_),c.fromBufferAttribute(n,m),a.add(h),l.add(h),c.add(h),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(_,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let u=0,p=e.count;u<p;u+=3)i.fromBufferAttribute(e,u+0),s.fromBufferAttribute(e,u+1),o.fromBufferAttribute(e,u+2),h.subVectors(o,s),d.subVectors(i,s),h.cross(d),n.setXYZ(u+0,h.x,h.y,h.z),n.setXYZ(u+1,h.x,h.y,h.z),n.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)be.fromBufferAttribute(t,e),be.normalize(),t.setXYZ(e,be.x,be.y,be.z)}toNonIndexed(){function t(a,l){const c=a.array,h=a.itemSize,d=a.normalized,u=new c.constructor(l.length*h);let p=0,g=0;for(let _=0,m=l.length;_<m;_++){a.isInterleavedBufferAttribute?p=l[_]*a.data.stride+a.offset:p=l[_]*h;for(let f=0;f<h;f++)u[g++]=c[p++]}return new Tn(u,h,d)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new on,n=this.index.array,i=this.attributes;for(const a in i){const l=i[a],c=t(l,n);e.setAttribute(a,c)}const s=this.morphAttributes;for(const a in s){const l=[],c=s[a];for(let h=0,d=c.length;h<d;h++){const u=c[h],p=t(u,n);l.push(p)}e.morphAttributes[a]=l}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const c=o[a];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const l in n){const c=n[l];t.data.attributes[l]=c.toJSON(t.data)}const i={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let d=0,u=c.length;d<u;d++){const p=c[d];h.push(p.toJSON(t.data))}h.length>0&&(i[l]=h,s=!0)}s&&(t.data.morphAttributes=i,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(t.data.boundingSphere=a.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone());const i=t.attributes;for(const c in i){const h=i[c];this.setAttribute(c,h.clone(e))}const s=t.morphAttributes;for(const c in s){const h=[],d=s[c];for(let u=0,p=d.length;u<p;u++)h.push(d[u].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let c=0,h=o.length;c<h;c++){const d=o[c];this.addGroup(d.start,d.count,d.materialIndex)}const a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const cc=new fe,ri=new Yl,Bs=new br,lc=new V,ks=new V,Vs=new V,Gs=new V,Jr=new V,Hs=new V,hc=new V,Ws=new V;class ze extends we{constructor(t=new on,e=new Oi){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=i.length;s<o;s++){const a=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}getVertexPosition(t,e){const n=this.geometry,i=n.attributes.position,s=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(i,t);const a=this.morphTargetInfluences;if(s&&a){Hs.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const h=a[l],d=s[l];h!==0&&(Jr.fromBufferAttribute(d,t),o?Hs.addScaledVector(Jr,h):Hs.addScaledVector(Jr.sub(e),h))}e.add(Hs)}return e}raycast(t,e){const n=this.geometry,i=this.material,s=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Bs.copy(n.boundingSphere),Bs.applyMatrix4(s),ri.copy(t.ray).recast(t.near),!(Bs.containsPoint(ri.origin)===!1&&(ri.intersectSphere(Bs,lc)===null||ri.origin.distanceToSquared(lc)>(t.far-t.near)**2))&&(cc.copy(s).invert(),ri.copy(t.ray).applyMatrix4(cc),!(n.boundingBox!==null&&ri.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,ri)))}_computeIntersections(t,e,n){let i;const s=this.geometry,o=this.material,a=s.index,l=s.attributes.position,c=s.attributes.uv,h=s.attributes.uv1,d=s.attributes.normal,u=s.groups,p=s.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,_=u.length;g<_;g++){const m=u[g],f=o[m.materialIndex],v=Math.max(m.start,p.start),S=Math.min(a.count,Math.min(m.start+m.count,p.start+p.count));for(let x=v,w=S;x<w;x+=3){const A=a.getX(x),R=a.getX(x+1),L=a.getX(x+2);i=Xs(this,f,t,n,c,h,d,A,R,L),i&&(i.faceIndex=Math.floor(x/3),i.face.materialIndex=m.materialIndex,e.push(i))}}else{const g=Math.max(0,p.start),_=Math.min(a.count,p.start+p.count);for(let m=g,f=_;m<f;m+=3){const v=a.getX(m),S=a.getX(m+1),x=a.getX(m+2);i=Xs(this,o,t,n,c,h,d,v,S,x),i&&(i.faceIndex=Math.floor(m/3),e.push(i))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,_=u.length;g<_;g++){const m=u[g],f=o[m.materialIndex],v=Math.max(m.start,p.start),S=Math.min(l.count,Math.min(m.start+m.count,p.start+p.count));for(let x=v,w=S;x<w;x+=3){const A=x,R=x+1,L=x+2;i=Xs(this,f,t,n,c,h,d,A,R,L),i&&(i.faceIndex=Math.floor(x/3),i.face.materialIndex=m.materialIndex,e.push(i))}}else{const g=Math.max(0,p.start),_=Math.min(l.count,p.start+p.count);for(let m=g,f=_;m<f;m+=3){const v=m,S=m+1,x=m+2;i=Xs(this,o,t,n,c,h,d,v,S,x),i&&(i.faceIndex=Math.floor(m/3),e.push(i))}}}}function Zu(r,t,e,n,i,s,o,a){let l;if(t.side===Be?l=n.intersectTriangle(o,s,i,!0,a):l=n.intersectTriangle(i,s,o,t.side===Qn,a),l===null)return null;Ws.copy(a),Ws.applyMatrix4(r.matrixWorld);const c=e.ray.origin.distanceTo(Ws);return c<e.near||c>e.far?null:{distance:c,point:Ws.clone(),object:r}}function Xs(r,t,e,n,i,s,o,a,l,c){r.getVertexPosition(a,ks),r.getVertexPosition(l,Vs),r.getVertexPosition(c,Gs);const h=Zu(r,t,e,n,ks,Vs,Gs,hc);if(h){const d=new V;rn.getBarycoord(hc,ks,Vs,Gs,d),i&&(h.uv=rn.getInterpolatedAttribute(i,a,l,c,d,new Kt)),s&&(h.uv1=rn.getInterpolatedAttribute(s,a,l,c,d,new Kt)),o&&(h.normal=rn.getInterpolatedAttribute(o,a,l,c,d,new V),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const u={a,b:l,c,normal:new V,materialIndex:0};rn.getNormal(ks,Vs,Gs,u.normal),h.face=u,h.barycoord=d}return h}class Vn extends on{constructor(t=1,e=1,n=1,i=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:i,heightSegments:s,depthSegments:o};const a=this;i=Math.floor(i),s=Math.floor(s),o=Math.floor(o);const l=[],c=[],h=[],d=[];let u=0,p=0;g("z","y","x",-1,-1,n,e,t,o,s,0),g("z","y","x",1,-1,n,e,-t,o,s,1),g("x","z","y",1,1,t,n,e,i,o,2),g("x","z","y",1,-1,t,n,-e,i,o,3),g("x","y","z",1,-1,t,e,n,i,s,4),g("x","y","z",-1,-1,t,e,-n,i,s,5),this.setIndex(l),this.setAttribute("position",new Le(c,3)),this.setAttribute("normal",new Le(h,3)),this.setAttribute("uv",new Le(d,2));function g(_,m,f,v,S,x,w,A,R,L,b){const E=x/R,P=w/L,H=x/2,I=w/2,F=A/2,O=R+1,N=L+1;let $=0,k=0;const K=new V;for(let ot=0;ot<N;ot++){const pt=ot*P-I;for(let st=0;st<O;st++){const $t=st*E-H;K[_]=$t*v,K[m]=pt*S,K[f]=F,c.push(K.x,K.y,K.z),K[_]=0,K[m]=0,K[f]=A>0?1:-1,h.push(K.x,K.y,K.z),d.push(st/R),d.push(1-ot/L),$+=1}}for(let ot=0;ot<L;ot++)for(let pt=0;pt<R;pt++){const st=u+pt+O*ot,$t=u+pt+O*(ot+1),Xt=u+(pt+1)+O*(ot+1),Z=u+(pt+1)+O*ot;l.push(st,$t,Z),l.push($t,Xt,Z),k+=6}a.addGroup(p,k,b),p+=k,u+=$}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Vn(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function $i(r){const t={};for(const e in r){t[e]={};for(const n in r[e]){const i=r[e][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=i.clone():Array.isArray(i)?t[e][n]=i.slice():t[e][n]=i}}return t}function Ne(r){const t={};for(let e=0;e<r.length;e++){const n=$i(r[e]);for(const i in n)t[i]=n[i]}return t}function ju(r){const t=[];for(let e=0;e<r.length;e++)t.push(r[e].clone());return t}function Jl(r){const t=r.getRenderTarget();return t===null?r.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Yt.workingColorSpace}const Ku={clone:$i,merge:Ne};var Ju=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Qu=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class ti extends Ki{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Ju,this.fragmentShader=Qu,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=$i(t.uniforms),this.uniformsGroups=ju(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const i in this.uniforms){const o=this.uniforms[i].value;o&&o.isTexture?e.uniforms[i]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[i]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[i]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[i]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[i]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[i]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[i]={type:"m4",value:o.toArray()}:e.uniforms[i]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class Ql extends we{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new fe,this.projectionMatrix=new fe,this.projectionMatrixInverse=new fe,this.coordinateSystem=En,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const $n=new V,uc=new Kt,dc=new Kt;class sn extends Ql{constructor(t=50,e=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=ha*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(dr*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return ha*2*Math.atan(Math.tan(dr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){$n.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set($n.x,$n.y).multiplyScalar(-t/$n.z),$n.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set($n.x,$n.y).multiplyScalar(-t/$n.z)}getViewSize(t,e){return this.getViewBounds(t,uc,dc),e.subVectors(dc,uc)}setViewOffset(t,e,n,i,s,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(dr*.5*this.fov)/this.zoom,n=2*e,i=this.aspect*n,s=-.5*i;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;s+=o.offsetX*i/l,e-=o.offsetY*n/c,i*=o.width/l,n*=o.height/c}const a=this.filmOffset;a!==0&&(s+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+i,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Li=-90,Di=1;class td extends we{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new sn(Li,Di,t,e);i.layers=this.layers,this.add(i);const s=new sn(Li,Di,t,e);s.layers=this.layers,this.add(s);const o=new sn(Li,Di,t,e);o.layers=this.layers,this.add(o);const a=new sn(Li,Di,t,e);a.layers=this.layers,this.add(a);const l=new sn(Li,Di,t,e);l.layers=this.layers,this.add(l);const c=new sn(Li,Di,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,i,s,o,a,l]=e;for(const c of e)this.remove(c);if(t===En)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===gr)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[s,o,a,l,c,h]=this.children,d=t.getRenderTarget(),u=t.getActiveCubeFace(),p=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,i),t.render(e,s),t.setRenderTarget(n,1,i),t.render(e,o),t.setRenderTarget(n,2,i),t.render(e,a),t.setRenderTarget(n,3,i),t.render(e,l),t.setRenderTarget(n,4,i),t.render(e,c),n.texture.generateMipmaps=_,t.setRenderTarget(n,5,i),t.render(e,h),t.setRenderTarget(d,u,p),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class th extends We{constructor(t=[],e=Xi,n,i,s,o,a,l,c,h){super(t,e,n,i,s,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class ed extends xi{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},i=[n,n,n,n,n,n];this.texture=new th(i),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},i=new Vn(5,5,5),s=new ti({name:"CubemapFromEquirect",uniforms:$i(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Be,blending:Kn});s.uniforms.tEquirect.value=e;const o=new ze(i,s),a=e.minFilter;return e.minFilter===_i&&(e.minFilter=Sn),new td(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e=!0,n=!0,i=!0){const s=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,i);t.setRenderTarget(s)}}class qs extends we{constructor(){super(),this.isGroup=!0,this.type="Group"}}const nd={type:"move"};class Qr{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new qs,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new qs,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new V,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new V),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new qs,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new V,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new V),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let i=null,s=null,o=null;const a=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(const _ of t.hand.values()){const m=e.getJointPose(_,n),f=this._getHandJoint(c,_);m!==null&&(f.matrix.fromArray(m.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=m.radius),f.visible=m!==null}const h=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],u=h.position.distanceTo(d.position),p=.02,g=.005;c.inputState.pinching&&u>p+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&u<=p-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(s=e.getPose(t.gripSpace,n),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(i=e.getPose(t.targetRaySpace,n),i===null&&s!==null&&(i=s),i!==null&&(a.matrix.fromArray(i.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,i.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(i.linearVelocity)):a.hasLinearVelocity=!1,i.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(i.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(nd)))}return a!==null&&(a.visible=i!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new qs;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}class Ea{constructor(t,e=1,n=1e3){this.isFog=!0,this.name="",this.color=new Ht(t),this.near=e,this.far=n}clone(){return new Ea(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class id extends we{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new wn,this.environmentIntensity=1,this.environmentRotation=new wn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}const to=new V,sd=new V,rd=new zt;class ui{constructor(t=new V(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,i){return this.normal.set(t,e,n),this.constant=i,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const i=to.subVectors(n,e).cross(sd.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(i,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(to),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const s=-(t.start.dot(this.normal)+this.constant)/i;return s<0||s>1?null:e.copy(t.start).addScaledVector(n,s)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||rd.getNormalMatrix(t),i=this.coplanarPoint(to).applyMatrix4(t),s=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(s),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const oi=new br,od=new Kt(.5,.5),Ys=new V;class Ta{constructor(t=new ui,e=new ui,n=new ui,i=new ui,s=new ui,o=new ui){this.planes=[t,e,n,i,s,o]}set(t,e,n,i,s,o){const a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(i),a[4].copy(s),a[5].copy(o),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=En,n=!1){const i=this.planes,s=t.elements,o=s[0],a=s[1],l=s[2],c=s[3],h=s[4],d=s[5],u=s[6],p=s[7],g=s[8],_=s[9],m=s[10],f=s[11],v=s[12],S=s[13],x=s[14],w=s[15];if(i[0].setComponents(c-o,p-h,f-g,w-v).normalize(),i[1].setComponents(c+o,p+h,f+g,w+v).normalize(),i[2].setComponents(c+a,p+d,f+_,w+S).normalize(),i[3].setComponents(c-a,p-d,f-_,w-S).normalize(),n)i[4].setComponents(l,u,m,x).normalize(),i[5].setComponents(c-l,p-u,f-m,w-x).normalize();else if(i[4].setComponents(c-l,p-u,f-m,w-x).normalize(),e===En)i[5].setComponents(c+l,p+u,f+m,w+x).normalize();else if(e===gr)i[5].setComponents(l,u,m,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),oi.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),oi.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(oi)}intersectsSprite(t){oi.center.set(0,0,0);const e=od.distanceTo(t.center);return oi.radius=.7071067811865476+e,oi.applyMatrix4(t.matrixWorld),this.intersectsSphere(oi)}intersectsSphere(t){const e=this.planes,n=t.center,i=-t.radius;for(let s=0;s<6;s++)if(e[s].distanceToPoint(n)<i)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const i=e[n];if(Ys.x=i.normal.x>0?t.max.x:t.min.x,Ys.y=i.normal.y>0?t.max.y:t.min.y,Ys.z=i.normal.z>0?t.max.z:t.min.z,i.distanceToPoint(Ys)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class us extends Ki{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Ht(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const vr=new V,xr=new V,fc=new fe,rs=new Yl,$s=new br,eo=new V,pc=new V;class eh extends we{constructor(t=new on,e=new us){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[0];for(let i=1,s=e.count;i<s;i++)vr.fromBufferAttribute(e,i-1),xr.fromBufferAttribute(e,i),n[i]=n[i-1],n[i]+=vr.distanceTo(xr);t.setAttribute("lineDistance",new Le(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const n=this.geometry,i=this.matrixWorld,s=t.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),$s.copy(n.boundingSphere),$s.applyMatrix4(i),$s.radius+=s,t.ray.intersectsSphere($s)===!1)return;fc.copy(i).invert(),rs.copy(t.ray).applyMatrix4(fc);const a=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,h=n.index,u=n.attributes.position;if(h!==null){const p=Math.max(0,o.start),g=Math.min(h.count,o.start+o.count);for(let _=p,m=g-1;_<m;_+=c){const f=h.getX(_),v=h.getX(_+1),S=Zs(this,t,rs,l,f,v,_);S&&e.push(S)}if(this.isLineLoop){const _=h.getX(g-1),m=h.getX(p),f=Zs(this,t,rs,l,_,m,g-1);f&&e.push(f)}}else{const p=Math.max(0,o.start),g=Math.min(u.count,o.start+o.count);for(let _=p,m=g-1;_<m;_+=c){const f=Zs(this,t,rs,l,_,_+1,_);f&&e.push(f)}if(this.isLineLoop){const _=Zs(this,t,rs,l,g-1,p,g-1);_&&e.push(_)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=i.length;s<o;s++){const a=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}}function Zs(r,t,e,n,i,s,o){const a=r.geometry.attributes.position;if(vr.fromBufferAttribute(a,i),xr.fromBufferAttribute(a,s),e.distanceSqToSegment(vr,xr,eo,pc)>n)return;eo.applyMatrix4(r.matrixWorld);const c=t.ray.origin.distanceTo(eo);if(!(c<t.near||c>t.far))return{distance:c,point:pc.clone().applyMatrix4(r.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:r}}const mc=new V,gc=new V;class ad extends eh{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[];for(let i=0,s=e.count;i<s;i+=2)mc.fromBufferAttribute(e,i),gc.fromBufferAttribute(e,i+1),n[i]=i===0?0:n[i-1],n[i+1]=n[i]+mc.distanceTo(gc);t.setAttribute("lineDistance",new Le(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class nh extends We{constructor(t,e,n=vi,i,s,o,a=fn,l=fn,c,h=_s,d=1){if(h!==_s&&h!==vs)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const u={width:t,height:e,depth:d};super(u,i,s,o,a,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new Sa(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const js=new V,Ks=new V,no=new V,Js=new rn;class cd extends on{constructor(t=null,e=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:t,thresholdAngle:e},t!==null){const i=Math.pow(10,4),s=Math.cos(dr*e),o=t.getIndex(),a=t.getAttribute("position"),l=o?o.count:a.count,c=[0,0,0],h=["a","b","c"],d=new Array(3),u={},p=[];for(let g=0;g<l;g+=3){o?(c[0]=o.getX(g),c[1]=o.getX(g+1),c[2]=o.getX(g+2)):(c[0]=g,c[1]=g+1,c[2]=g+2);const{a:_,b:m,c:f}=Js;if(_.fromBufferAttribute(a,c[0]),m.fromBufferAttribute(a,c[1]),f.fromBufferAttribute(a,c[2]),Js.getNormal(no),d[0]=`${Math.round(_.x*i)},${Math.round(_.y*i)},${Math.round(_.z*i)}`,d[1]=`${Math.round(m.x*i)},${Math.round(m.y*i)},${Math.round(m.z*i)}`,d[2]=`${Math.round(f.x*i)},${Math.round(f.y*i)},${Math.round(f.z*i)}`,!(d[0]===d[1]||d[1]===d[2]||d[2]===d[0]))for(let v=0;v<3;v++){const S=(v+1)%3,x=d[v],w=d[S],A=Js[h[v]],R=Js[h[S]],L=`${x}_${w}`,b=`${w}_${x}`;b in u&&u[b]?(no.dot(u[b].normal)<=s&&(p.push(A.x,A.y,A.z),p.push(R.x,R.y,R.z)),u[b]=null):L in u||(u[L]={index0:c[v],index1:c[S],normal:no.clone()})}}for(const g in u)if(u[g]){const{index0:_,index1:m}=u[g];js.fromBufferAttribute(a,_),Ks.fromBufferAttribute(a,m),p.push(js.x,js.y,js.z),p.push(Ks.x,Ks.y,Ks.z)}this.setAttribute("position",new Le(p,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}}class wr extends on{constructor(t=1,e=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:i};const s=t/2,o=e/2,a=Math.floor(n),l=Math.floor(i),c=a+1,h=l+1,d=t/a,u=e/l,p=[],g=[],_=[],m=[];for(let f=0;f<h;f++){const v=f*u-o;for(let S=0;S<c;S++){const x=S*d-s;g.push(x,-v,0),_.push(0,0,1),m.push(S/a),m.push(1-f/l)}}for(let f=0;f<l;f++)for(let v=0;v<a;v++){const S=v+c*f,x=v+c*(f+1),w=v+1+c*(f+1),A=v+1+c*f;p.push(S,x,A),p.push(x,w,A)}this.setIndex(p),this.setAttribute("position",new Le(g,3)),this.setAttribute("normal",new Le(_,3)),this.setAttribute("uv",new Le(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new wr(t.width,t.height,t.widthSegments,t.heightSegments)}}class ba extends on{constructor(t=1,e=32,n=16,i=0,s=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:i,phiLength:s,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const l=Math.min(o+a,Math.PI);let c=0;const h=[],d=new V,u=new V,p=[],g=[],_=[],m=[];for(let f=0;f<=n;f++){const v=[],S=f/n;let x=0;f===0&&o===0?x=.5/e:f===n&&l===Math.PI&&(x=-.5/e);for(let w=0;w<=e;w++){const A=w/e;d.x=-t*Math.cos(i+A*s)*Math.sin(o+S*a),d.y=t*Math.cos(o+S*a),d.z=t*Math.sin(i+A*s)*Math.sin(o+S*a),g.push(d.x,d.y,d.z),u.copy(d).normalize(),_.push(u.x,u.y,u.z),m.push(A+x,1-S),v.push(c++)}h.push(v)}for(let f=0;f<n;f++)for(let v=0;v<e;v++){const S=h[f][v+1],x=h[f][v],w=h[f+1][v],A=h[f+1][v+1];(f!==0||o>0)&&p.push(S,x,A),(f!==n-1||l<Math.PI)&&p.push(x,w,A)}this.setIndex(p),this.setAttribute("position",new Le(g,3)),this.setAttribute("normal",new Le(_,3)),this.setAttribute("uv",new Le(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ba(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class wa extends on{constructor(t=1,e=.4,n=12,i=48,s=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:i,arc:s},n=Math.floor(n),i=Math.floor(i);const o=[],a=[],l=[],c=[],h=new V,d=new V,u=new V;for(let p=0;p<=n;p++)for(let g=0;g<=i;g++){const _=g/i*s,m=p/n*Math.PI*2;d.x=(t+e*Math.cos(m))*Math.cos(_),d.y=(t+e*Math.cos(m))*Math.sin(_),d.z=e*Math.sin(m),a.push(d.x,d.y,d.z),h.x=t*Math.cos(_),h.y=t*Math.sin(_),u.subVectors(d,h).normalize(),l.push(u.x,u.y,u.z),c.push(g/i),c.push(p/n)}for(let p=1;p<=n;p++)for(let g=1;g<=i;g++){const _=(i+1)*p+g-1,m=(i+1)*(p-1)+g-1,f=(i+1)*(p-1)+g,v=(i+1)*p+g;o.push(_,m,v),o.push(m,f,v)}this.setIndex(o),this.setAttribute("position",new Le(a,3)),this.setAttribute("normal",new Le(l,3)),this.setAttribute("uv",new Le(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new wa(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class os extends Ki{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Ht(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ht(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Hl,this.normalScale=new Kt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new wn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class ld extends Ki{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=yu,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class hd extends Ki{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}class ih extends we{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Ht(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class ud extends ih{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(we.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Ht(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const io=new fe,_c=new V,vc=new V;class dd{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Kt(512,512),this.mapType=bn,this.map=null,this.mapPass=null,this.matrix=new fe,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Ta,this._frameExtents=new Kt(1,1),this._viewportCount=1,this._viewports=[new de(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;_c.setFromMatrixPosition(t.matrixWorld),e.position.copy(_c),vc.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(vc),e.updateMatrixWorld(),io.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(io,e.coordinateSystem,e.reversedDepth),e.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(io)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class sh extends Ql{constructor(t=-1,e=1,n=1,i=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=i,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,i,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let s=n-t,o=n+t,a=i+e,l=i-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,o=s+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(s,o,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}class fd extends dd{constructor(){super(new sh(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class xc extends ih{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(we.DEFAULT_UP),this.updateMatrix(),this.target=new we,this.shadow=new fd}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class pd extends sn{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}}function yc(r,t,e,n){const i=md(n);switch(e){case zl:return r*t;case kl:return r*t/i.components*i.byteLength;case xa:return r*t/i.components*i.byteLength;case Vl:return r*t*2/i.components*i.byteLength;case ya:return r*t*2/i.components*i.byteLength;case Bl:return r*t*3/i.components*i.byteLength;case un:return r*t*4/i.components*i.byteLength;case Ma:return r*t*4/i.components*i.byteLength;case ar:case cr:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*8;case lr:case hr:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*16;case Bo:case Vo:return Math.max(r,16)*Math.max(t,8)/4;case zo:case ko:return Math.max(r,8)*Math.max(t,8)/2;case Go:case Ho:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*8;case Wo:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*16;case Xo:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*16;case qo:return Math.floor((r+4)/5)*Math.floor((t+3)/4)*16;case Yo:return Math.floor((r+4)/5)*Math.floor((t+4)/5)*16;case $o:return Math.floor((r+5)/6)*Math.floor((t+4)/5)*16;case Zo:return Math.floor((r+5)/6)*Math.floor((t+5)/6)*16;case jo:return Math.floor((r+7)/8)*Math.floor((t+4)/5)*16;case Ko:return Math.floor((r+7)/8)*Math.floor((t+5)/6)*16;case Jo:return Math.floor((r+7)/8)*Math.floor((t+7)/8)*16;case Qo:return Math.floor((r+9)/10)*Math.floor((t+4)/5)*16;case ta:return Math.floor((r+9)/10)*Math.floor((t+5)/6)*16;case ea:return Math.floor((r+9)/10)*Math.floor((t+7)/8)*16;case na:return Math.floor((r+9)/10)*Math.floor((t+9)/10)*16;case ia:return Math.floor((r+11)/12)*Math.floor((t+9)/10)*16;case sa:return Math.floor((r+11)/12)*Math.floor((t+11)/12)*16;case ur:case ra:case oa:return Math.ceil(r/4)*Math.ceil(t/4)*16;case Gl:case aa:return Math.ceil(r/4)*Math.ceil(t/4)*8;case ca:case la:return Math.ceil(r/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function md(r){switch(r){case bn:case Ul:return{byteLength:1,components:1};case ms:case Fl:case Ms:return{byteLength:2,components:1};case _a:case va:return{byteLength:2,components:4};case vi:case ga:case kn:return{byteLength:4,components:1};case Ol:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${r}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:ma}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=ma);function rh(){let r=null,t=!1,e=null,n=null;function i(s,o){e(s,o),n=r.requestAnimationFrame(i)}return{start:function(){t!==!0&&e!==null&&(n=r.requestAnimationFrame(i),t=!0)},stop:function(){r.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(s){e=s},setContext:function(s){r=s}}}function gd(r){const t=new WeakMap;function e(a,l){const c=a.array,h=a.usage,d=c.byteLength,u=r.createBuffer();r.bindBuffer(l,u),r.bufferData(l,c,h),a.onUploadCallback();let p;if(c instanceof Float32Array)p=r.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)p=r.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?p=r.HALF_FLOAT:p=r.UNSIGNED_SHORT;else if(c instanceof Int16Array)p=r.SHORT;else if(c instanceof Uint32Array)p=r.UNSIGNED_INT;else if(c instanceof Int32Array)p=r.INT;else if(c instanceof Int8Array)p=r.BYTE;else if(c instanceof Uint8Array)p=r.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)p=r.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:u,type:p,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:d}}function n(a,l,c){const h=l.array,d=l.updateRanges;if(r.bindBuffer(c,a),d.length===0)r.bufferSubData(c,0,h);else{d.sort((p,g)=>p.start-g.start);let u=0;for(let p=1;p<d.length;p++){const g=d[u],_=d[p];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++u,d[u]=_)}d.length=u+1;for(let p=0,g=d.length;p<g;p++){const _=d[p];r.bufferSubData(c,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function i(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function s(a){a.isInterleavedBufferAttribute&&(a=a.data);const l=t.get(a);l&&(r.deleteBuffer(l.buffer),t.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const h=t.get(a);(!h||h.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const c=t.get(a);if(c===void 0)t.set(a,e(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:i,remove:s,update:o}}var _d=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,vd=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,xd=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,yd=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Md=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Sd=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Ed=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Td=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,bd=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,wd=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Ad=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Rd=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Cd=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Pd=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Id=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Ld=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Dd=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Nd=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Ud=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Fd=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Od=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,zd=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Bd=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,kd=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Vd=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Gd=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Hd=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Wd=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Xd=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,qd=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Yd="gl_FragColor = linearToOutputTexel( gl_FragColor );",$d=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Zd=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,jd=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Kd=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Jd=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Qd=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,tf=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,ef=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,nf=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,sf=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,rf=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,of=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,af=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,cf=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,lf=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,hf=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,uf=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,df=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,ff=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,pf=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,mf=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,gf=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,_f=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,vf=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,xf=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,yf=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Mf=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Sf=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Ef=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Tf=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,bf=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,wf=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Af=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Rf=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Cf=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Pf=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,If=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Lf=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Df=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Nf=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Uf=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Ff=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Of=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,zf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Bf=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,kf=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Vf=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Gf=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Hf=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Wf=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Xf=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,qf=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Yf=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,$f=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Zf=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,jf=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Kf=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Jf=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Qf=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		float depth = unpackRGBAToDepth( texture2D( depths, uv ) );
		#ifdef USE_REVERSEDEPTHBUF
			return step( depth, compare );
		#else
			return step( compare, depth );
		#endif
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		#ifdef USE_REVERSEDEPTHBUF
			float hard_shadow = step( distribution.x, compare );
		#else
			float hard_shadow = step( compare , distribution.x );
		#endif
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,tp=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,ep=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,np=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,ip=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,sp=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,rp=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,op=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,ap=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,cp=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,lp=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,hp=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,up=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,dp=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,fp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,pp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,mp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,gp=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const _p=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,vp=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,xp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,yp=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Mp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Sp=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Ep=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Tp=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSEDEPTHBUF
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,bp=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,wp=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,Ap=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Rp=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Cp=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Pp=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Ip=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Lp=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Dp=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Np=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Up=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Fp=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Op=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,zp=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Bp=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,kp=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Vp=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Gp=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Hp=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Wp=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Xp=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,qp=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Yp=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,$p=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Zp=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,jp=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Bt={alphahash_fragment:_d,alphahash_pars_fragment:vd,alphamap_fragment:xd,alphamap_pars_fragment:yd,alphatest_fragment:Md,alphatest_pars_fragment:Sd,aomap_fragment:Ed,aomap_pars_fragment:Td,batching_pars_vertex:bd,batching_vertex:wd,begin_vertex:Ad,beginnormal_vertex:Rd,bsdfs:Cd,iridescence_fragment:Pd,bumpmap_pars_fragment:Id,clipping_planes_fragment:Ld,clipping_planes_pars_fragment:Dd,clipping_planes_pars_vertex:Nd,clipping_planes_vertex:Ud,color_fragment:Fd,color_pars_fragment:Od,color_pars_vertex:zd,color_vertex:Bd,common:kd,cube_uv_reflection_fragment:Vd,defaultnormal_vertex:Gd,displacementmap_pars_vertex:Hd,displacementmap_vertex:Wd,emissivemap_fragment:Xd,emissivemap_pars_fragment:qd,colorspace_fragment:Yd,colorspace_pars_fragment:$d,envmap_fragment:Zd,envmap_common_pars_fragment:jd,envmap_pars_fragment:Kd,envmap_pars_vertex:Jd,envmap_physical_pars_fragment:hf,envmap_vertex:Qd,fog_vertex:tf,fog_pars_vertex:ef,fog_fragment:nf,fog_pars_fragment:sf,gradientmap_pars_fragment:rf,lightmap_pars_fragment:of,lights_lambert_fragment:af,lights_lambert_pars_fragment:cf,lights_pars_begin:lf,lights_toon_fragment:uf,lights_toon_pars_fragment:df,lights_phong_fragment:ff,lights_phong_pars_fragment:pf,lights_physical_fragment:mf,lights_physical_pars_fragment:gf,lights_fragment_begin:_f,lights_fragment_maps:vf,lights_fragment_end:xf,logdepthbuf_fragment:yf,logdepthbuf_pars_fragment:Mf,logdepthbuf_pars_vertex:Sf,logdepthbuf_vertex:Ef,map_fragment:Tf,map_pars_fragment:bf,map_particle_fragment:wf,map_particle_pars_fragment:Af,metalnessmap_fragment:Rf,metalnessmap_pars_fragment:Cf,morphinstance_vertex:Pf,morphcolor_vertex:If,morphnormal_vertex:Lf,morphtarget_pars_vertex:Df,morphtarget_vertex:Nf,normal_fragment_begin:Uf,normal_fragment_maps:Ff,normal_pars_fragment:Of,normal_pars_vertex:zf,normal_vertex:Bf,normalmap_pars_fragment:kf,clearcoat_normal_fragment_begin:Vf,clearcoat_normal_fragment_maps:Gf,clearcoat_pars_fragment:Hf,iridescence_pars_fragment:Wf,opaque_fragment:Xf,packing:qf,premultiplied_alpha_fragment:Yf,project_vertex:$f,dithering_fragment:Zf,dithering_pars_fragment:jf,roughnessmap_fragment:Kf,roughnessmap_pars_fragment:Jf,shadowmap_pars_fragment:Qf,shadowmap_pars_vertex:tp,shadowmap_vertex:ep,shadowmask_pars_fragment:np,skinbase_vertex:ip,skinning_pars_vertex:sp,skinning_vertex:rp,skinnormal_vertex:op,specularmap_fragment:ap,specularmap_pars_fragment:cp,tonemapping_fragment:lp,tonemapping_pars_fragment:hp,transmission_fragment:up,transmission_pars_fragment:dp,uv_pars_fragment:fp,uv_pars_vertex:pp,uv_vertex:mp,worldpos_vertex:gp,background_vert:_p,background_frag:vp,backgroundCube_vert:xp,backgroundCube_frag:yp,cube_vert:Mp,cube_frag:Sp,depth_vert:Ep,depth_frag:Tp,distanceRGBA_vert:bp,distanceRGBA_frag:wp,equirect_vert:Ap,equirect_frag:Rp,linedashed_vert:Cp,linedashed_frag:Pp,meshbasic_vert:Ip,meshbasic_frag:Lp,meshlambert_vert:Dp,meshlambert_frag:Np,meshmatcap_vert:Up,meshmatcap_frag:Fp,meshnormal_vert:Op,meshnormal_frag:zp,meshphong_vert:Bp,meshphong_frag:kp,meshphysical_vert:Vp,meshphysical_frag:Gp,meshtoon_vert:Hp,meshtoon_frag:Wp,points_vert:Xp,points_frag:qp,shadow_vert:Yp,shadow_frag:$p,sprite_vert:Zp,sprite_frag:jp},ht={common:{diffuse:{value:new Ht(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new zt},alphaMap:{value:null},alphaMapTransform:{value:new zt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new zt}},envmap:{envMap:{value:null},envMapRotation:{value:new zt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new zt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new zt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new zt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new zt},normalScale:{value:new Kt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new zt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new zt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new zt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new zt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ht(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ht(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new zt},alphaTest:{value:0},uvTransform:{value:new zt}},sprite:{diffuse:{value:new Ht(16777215)},opacity:{value:1},center:{value:new Kt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new zt},alphaMap:{value:null},alphaMapTransform:{value:new zt},alphaTest:{value:0}}},yn={basic:{uniforms:Ne([ht.common,ht.specularmap,ht.envmap,ht.aomap,ht.lightmap,ht.fog]),vertexShader:Bt.meshbasic_vert,fragmentShader:Bt.meshbasic_frag},lambert:{uniforms:Ne([ht.common,ht.specularmap,ht.envmap,ht.aomap,ht.lightmap,ht.emissivemap,ht.bumpmap,ht.normalmap,ht.displacementmap,ht.fog,ht.lights,{emissive:{value:new Ht(0)}}]),vertexShader:Bt.meshlambert_vert,fragmentShader:Bt.meshlambert_frag},phong:{uniforms:Ne([ht.common,ht.specularmap,ht.envmap,ht.aomap,ht.lightmap,ht.emissivemap,ht.bumpmap,ht.normalmap,ht.displacementmap,ht.fog,ht.lights,{emissive:{value:new Ht(0)},specular:{value:new Ht(1118481)},shininess:{value:30}}]),vertexShader:Bt.meshphong_vert,fragmentShader:Bt.meshphong_frag},standard:{uniforms:Ne([ht.common,ht.envmap,ht.aomap,ht.lightmap,ht.emissivemap,ht.bumpmap,ht.normalmap,ht.displacementmap,ht.roughnessmap,ht.metalnessmap,ht.fog,ht.lights,{emissive:{value:new Ht(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Bt.meshphysical_vert,fragmentShader:Bt.meshphysical_frag},toon:{uniforms:Ne([ht.common,ht.aomap,ht.lightmap,ht.emissivemap,ht.bumpmap,ht.normalmap,ht.displacementmap,ht.gradientmap,ht.fog,ht.lights,{emissive:{value:new Ht(0)}}]),vertexShader:Bt.meshtoon_vert,fragmentShader:Bt.meshtoon_frag},matcap:{uniforms:Ne([ht.common,ht.bumpmap,ht.normalmap,ht.displacementmap,ht.fog,{matcap:{value:null}}]),vertexShader:Bt.meshmatcap_vert,fragmentShader:Bt.meshmatcap_frag},points:{uniforms:Ne([ht.points,ht.fog]),vertexShader:Bt.points_vert,fragmentShader:Bt.points_frag},dashed:{uniforms:Ne([ht.common,ht.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Bt.linedashed_vert,fragmentShader:Bt.linedashed_frag},depth:{uniforms:Ne([ht.common,ht.displacementmap]),vertexShader:Bt.depth_vert,fragmentShader:Bt.depth_frag},normal:{uniforms:Ne([ht.common,ht.bumpmap,ht.normalmap,ht.displacementmap,{opacity:{value:1}}]),vertexShader:Bt.meshnormal_vert,fragmentShader:Bt.meshnormal_frag},sprite:{uniforms:Ne([ht.sprite,ht.fog]),vertexShader:Bt.sprite_vert,fragmentShader:Bt.sprite_frag},background:{uniforms:{uvTransform:{value:new zt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Bt.background_vert,fragmentShader:Bt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new zt}},vertexShader:Bt.backgroundCube_vert,fragmentShader:Bt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Bt.cube_vert,fragmentShader:Bt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Bt.equirect_vert,fragmentShader:Bt.equirect_frag},distanceRGBA:{uniforms:Ne([ht.common,ht.displacementmap,{referencePosition:{value:new V},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Bt.distanceRGBA_vert,fragmentShader:Bt.distanceRGBA_frag},shadow:{uniforms:Ne([ht.lights,ht.fog,{color:{value:new Ht(0)},opacity:{value:1}}]),vertexShader:Bt.shadow_vert,fragmentShader:Bt.shadow_frag}};yn.physical={uniforms:Ne([yn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new zt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new zt},clearcoatNormalScale:{value:new Kt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new zt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new zt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new zt},sheen:{value:0},sheenColor:{value:new Ht(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new zt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new zt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new zt},transmissionSamplerSize:{value:new Kt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new zt},attenuationDistance:{value:0},attenuationColor:{value:new Ht(0)},specularColor:{value:new Ht(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new zt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new zt},anisotropyVector:{value:new Kt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new zt}}]),vertexShader:Bt.meshphysical_vert,fragmentShader:Bt.meshphysical_frag};const Qs={r:0,b:0,g:0},ai=new wn,Kp=new fe;function Jp(r,t,e,n,i,s,o){const a=new Ht(0);let l=s===!0?0:1,c,h,d=null,u=0,p=null;function g(S){let x=S.isScene===!0?S.background:null;return x&&x.isTexture&&(x=(S.backgroundBlurriness>0?e:t).get(x)),x}function _(S){let x=!1;const w=g(S);w===null?f(a,l):w&&w.isColor&&(f(w,1),x=!0);const A=r.xr.getEnvironmentBlendMode();A==="additive"?n.buffers.color.setClear(0,0,0,1,o):A==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(r.autoClear||x)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),r.clear(r.autoClearColor,r.autoClearDepth,r.autoClearStencil))}function m(S,x){const w=g(x);w&&(w.isCubeTexture||w.mapping===Tr)?(h===void 0&&(h=new ze(new Vn(1,1,1),new ti({name:"BackgroundCubeMaterial",uniforms:$i(yn.backgroundCube.uniforms),vertexShader:yn.backgroundCube.vertexShader,fragmentShader:yn.backgroundCube.fragmentShader,side:Be,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(A,R,L){this.matrixWorld.copyPosition(L.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(h)),ai.copy(x.backgroundRotation),ai.x*=-1,ai.y*=-1,ai.z*=-1,w.isCubeTexture&&w.isRenderTargetTexture===!1&&(ai.y*=-1,ai.z*=-1),h.material.uniforms.envMap.value=w,h.material.uniforms.flipEnvMap.value=w.isCubeTexture&&w.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=x.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(Kp.makeRotationFromEuler(ai)),h.material.toneMapped=Yt.getTransfer(w.colorSpace)!==ne,(d!==w||u!==w.version||p!==r.toneMapping)&&(h.material.needsUpdate=!0,d=w,u=w.version,p=r.toneMapping),h.layers.enableAll(),S.unshift(h,h.geometry,h.material,0,0,null)):w&&w.isTexture&&(c===void 0&&(c=new ze(new wr(2,2),new ti({name:"BackgroundMaterial",uniforms:$i(yn.background.uniforms),vertexShader:yn.background.vertexShader,fragmentShader:yn.background.fragmentShader,side:Qn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(c)),c.material.uniforms.t2D.value=w,c.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,c.material.toneMapped=Yt.getTransfer(w.colorSpace)!==ne,w.matrixAutoUpdate===!0&&w.updateMatrix(),c.material.uniforms.uvTransform.value.copy(w.matrix),(d!==w||u!==w.version||p!==r.toneMapping)&&(c.material.needsUpdate=!0,d=w,u=w.version,p=r.toneMapping),c.layers.enableAll(),S.unshift(c,c.geometry,c.material,0,0,null))}function f(S,x){S.getRGB(Qs,Jl(r)),n.buffers.color.setClear(Qs.r,Qs.g,Qs.b,x,o)}function v(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return a},setClearColor:function(S,x=1){a.set(S),l=x,f(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(S){l=S,f(a,l)},render:_,addToRenderList:m,dispose:v}}function Qp(r,t){const e=r.getParameter(r.MAX_VERTEX_ATTRIBS),n={},i=u(null);let s=i,o=!1;function a(E,P,H,I,F){let O=!1;const N=d(I,H,P);s!==N&&(s=N,c(s.object)),O=p(E,I,H,F),O&&g(E,I,H,F),F!==null&&t.update(F,r.ELEMENT_ARRAY_BUFFER),(O||o)&&(o=!1,x(E,P,H,I),F!==null&&r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,t.get(F).buffer))}function l(){return r.createVertexArray()}function c(E){return r.bindVertexArray(E)}function h(E){return r.deleteVertexArray(E)}function d(E,P,H){const I=H.wireframe===!0;let F=n[E.id];F===void 0&&(F={},n[E.id]=F);let O=F[P.id];O===void 0&&(O={},F[P.id]=O);let N=O[I];return N===void 0&&(N=u(l()),O[I]=N),N}function u(E){const P=[],H=[],I=[];for(let F=0;F<e;F++)P[F]=0,H[F]=0,I[F]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:P,enabledAttributes:H,attributeDivisors:I,object:E,attributes:{},index:null}}function p(E,P,H,I){const F=s.attributes,O=P.attributes;let N=0;const $=H.getAttributes();for(const k in $)if($[k].location>=0){const ot=F[k];let pt=O[k];if(pt===void 0&&(k==="instanceMatrix"&&E.instanceMatrix&&(pt=E.instanceMatrix),k==="instanceColor"&&E.instanceColor&&(pt=E.instanceColor)),ot===void 0||ot.attribute!==pt||pt&&ot.data!==pt.data)return!0;N++}return s.attributesNum!==N||s.index!==I}function g(E,P,H,I){const F={},O=P.attributes;let N=0;const $=H.getAttributes();for(const k in $)if($[k].location>=0){let ot=O[k];ot===void 0&&(k==="instanceMatrix"&&E.instanceMatrix&&(ot=E.instanceMatrix),k==="instanceColor"&&E.instanceColor&&(ot=E.instanceColor));const pt={};pt.attribute=ot,ot&&ot.data&&(pt.data=ot.data),F[k]=pt,N++}s.attributes=F,s.attributesNum=N,s.index=I}function _(){const E=s.newAttributes;for(let P=0,H=E.length;P<H;P++)E[P]=0}function m(E){f(E,0)}function f(E,P){const H=s.newAttributes,I=s.enabledAttributes,F=s.attributeDivisors;H[E]=1,I[E]===0&&(r.enableVertexAttribArray(E),I[E]=1),F[E]!==P&&(r.vertexAttribDivisor(E,P),F[E]=P)}function v(){const E=s.newAttributes,P=s.enabledAttributes;for(let H=0,I=P.length;H<I;H++)P[H]!==E[H]&&(r.disableVertexAttribArray(H),P[H]=0)}function S(E,P,H,I,F,O,N){N===!0?r.vertexAttribIPointer(E,P,H,F,O):r.vertexAttribPointer(E,P,H,I,F,O)}function x(E,P,H,I){_();const F=I.attributes,O=H.getAttributes(),N=P.defaultAttributeValues;for(const $ in O){const k=O[$];if(k.location>=0){let K=F[$];if(K===void 0&&($==="instanceMatrix"&&E.instanceMatrix&&(K=E.instanceMatrix),$==="instanceColor"&&E.instanceColor&&(K=E.instanceColor)),K!==void 0){const ot=K.normalized,pt=K.itemSize,st=t.get(K);if(st===void 0)continue;const $t=st.buffer,Xt=st.type,Z=st.bytesPerElement,lt=Xt===r.INT||Xt===r.UNSIGNED_INT||K.gpuType===ga;if(K.isInterleavedBufferAttribute){const rt=K.data,Pt=rt.stride,It=K.offset;if(rt.isInstancedInterleavedBuffer){for(let Ut=0;Ut<k.locationSize;Ut++)f(k.location+Ut,rt.meshPerAttribute);E.isInstancedMesh!==!0&&I._maxInstanceCount===void 0&&(I._maxInstanceCount=rt.meshPerAttribute*rt.count)}else for(let Ut=0;Ut<k.locationSize;Ut++)m(k.location+Ut);r.bindBuffer(r.ARRAY_BUFFER,$t);for(let Ut=0;Ut<k.locationSize;Ut++)S(k.location+Ut,pt/k.locationSize,Xt,ot,Pt*Z,(It+pt/k.locationSize*Ut)*Z,lt)}else{if(K.isInstancedBufferAttribute){for(let rt=0;rt<k.locationSize;rt++)f(k.location+rt,K.meshPerAttribute);E.isInstancedMesh!==!0&&I._maxInstanceCount===void 0&&(I._maxInstanceCount=K.meshPerAttribute*K.count)}else for(let rt=0;rt<k.locationSize;rt++)m(k.location+rt);r.bindBuffer(r.ARRAY_BUFFER,$t);for(let rt=0;rt<k.locationSize;rt++)S(k.location+rt,pt/k.locationSize,Xt,ot,pt*Z,pt/k.locationSize*rt*Z,lt)}}else if(N!==void 0){const ot=N[$];if(ot!==void 0)switch(ot.length){case 2:r.vertexAttrib2fv(k.location,ot);break;case 3:r.vertexAttrib3fv(k.location,ot);break;case 4:r.vertexAttrib4fv(k.location,ot);break;default:r.vertexAttrib1fv(k.location,ot)}}}}v()}function w(){L();for(const E in n){const P=n[E];for(const H in P){const I=P[H];for(const F in I)h(I[F].object),delete I[F];delete P[H]}delete n[E]}}function A(E){if(n[E.id]===void 0)return;const P=n[E.id];for(const H in P){const I=P[H];for(const F in I)h(I[F].object),delete I[F];delete P[H]}delete n[E.id]}function R(E){for(const P in n){const H=n[P];if(H[E.id]===void 0)continue;const I=H[E.id];for(const F in I)h(I[F].object),delete I[F];delete H[E.id]}}function L(){b(),o=!0,s!==i&&(s=i,c(s.object))}function b(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:a,reset:L,resetDefaultState:b,dispose:w,releaseStatesOfGeometry:A,releaseStatesOfProgram:R,initAttributes:_,enableAttribute:m,disableUnusedAttributes:v}}function tm(r,t,e){let n;function i(c){n=c}function s(c,h){r.drawArrays(n,c,h),e.update(h,n,1)}function o(c,h,d){d!==0&&(r.drawArraysInstanced(n,c,h,d),e.update(h,n,d))}function a(c,h,d){if(d===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,h,0,d);let p=0;for(let g=0;g<d;g++)p+=h[g];e.update(p,n,1)}function l(c,h,d,u){if(d===0)return;const p=t.get("WEBGL_multi_draw");if(p===null)for(let g=0;g<c.length;g++)o(c[g],h[g],u[g]);else{p.multiDrawArraysInstancedWEBGL(n,c,0,h,0,u,0,d);let g=0;for(let _=0;_<d;_++)g+=h[_]*u[_];e.update(g,n,1)}}this.setMode=i,this.render=s,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function em(r,t,e,n){let i;function s(){if(i!==void 0)return i;if(t.has("EXT_texture_filter_anisotropic")===!0){const R=t.get("EXT_texture_filter_anisotropic");i=r.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(R){return!(R!==un&&n.convert(R)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(R){const L=R===Ms&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(R!==bn&&n.convert(R)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_TYPE)&&R!==kn&&!L)}function l(R){if(R==="highp"){if(r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.HIGH_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.HIGH_FLOAT).precision>0)return"highp";R="mediump"}return R==="mediump"&&r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.MEDIUM_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp";const h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const d=e.logarithmicDepthBuffer===!0,u=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),p=r.getParameter(r.MAX_TEXTURE_IMAGE_UNITS),g=r.getParameter(r.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=r.getParameter(r.MAX_TEXTURE_SIZE),m=r.getParameter(r.MAX_CUBE_MAP_TEXTURE_SIZE),f=r.getParameter(r.MAX_VERTEX_ATTRIBS),v=r.getParameter(r.MAX_VERTEX_UNIFORM_VECTORS),S=r.getParameter(r.MAX_VARYING_VECTORS),x=r.getParameter(r.MAX_FRAGMENT_UNIFORM_VECTORS),w=g>0,A=r.getParameter(r.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:d,reversedDepthBuffer:u,maxTextures:p,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:m,maxAttributes:f,maxVertexUniforms:v,maxVaryings:S,maxFragmentUniforms:x,vertexTextures:w,maxSamples:A}}function nm(r){const t=this;let e=null,n=0,i=!1,s=!1;const o=new ui,a=new zt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,u){const p=d.length!==0||u||n!==0||i;return i=u,n=d.length,p},this.beginShadows=function(){s=!0,h(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(d,u){e=h(d,u,0)},this.setState=function(d,u,p){const g=d.clippingPlanes,_=d.clipIntersection,m=d.clipShadows,f=r.get(d);if(!i||g===null||g.length===0||s&&!m)s?h(null):c();else{const v=s?0:n,S=v*4;let x=f.clippingState||null;l.value=x,x=h(g,u,S,p);for(let w=0;w!==S;++w)x[w]=e[w];f.clippingState=x,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=v}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(d,u,p,g){const _=d!==null?d.length:0;let m=null;if(_!==0){if(m=l.value,g!==!0||m===null){const f=p+_*4,v=u.matrixWorldInverse;a.getNormalMatrix(v),(m===null||m.length<f)&&(m=new Float32Array(f));for(let S=0,x=p;S!==_;++S,x+=4)o.copy(d[S]).applyMatrix4(v,a),o.normal.toArray(m,x),m[x+3]=o.constant}l.value=m,l.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,m}}function im(r){let t=new WeakMap;function e(o,a){return a===No?o.mapping=Xi:a===Uo&&(o.mapping=qi),o}function n(o){if(o&&o.isTexture){const a=o.mapping;if(a===No||a===Uo)if(t.has(o)){const l=t.get(o).texture;return e(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new ed(l.height);return c.fromEquirectangularTexture(r,o),t.set(o,c),o.addEventListener("dispose",i),e(c.texture,o.mapping)}else return null}}return o}function i(o){const a=o.target;a.removeEventListener("dispose",i);const l=t.get(a);l!==void 0&&(t.delete(a),l.dispose())}function s(){t=new WeakMap}return{get:n,dispose:s}}const zi=4,Mc=[.125,.215,.35,.446,.526,.582],pi=20,so=new sh,Sc=new Ht;let ro=null,oo=0,ao=0,co=!1;const di=(1+Math.sqrt(5))/2,Ni=1/di,Ec=[new V(-di,Ni,0),new V(di,Ni,0),new V(-Ni,0,di),new V(Ni,0,di),new V(0,di,-Ni),new V(0,di,Ni),new V(-1,1,-1),new V(1,1,-1),new V(-1,1,1),new V(1,1,1)],sm=new V;class Tc{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,i=100,s={}){const{size:o=256,position:a=sm}=s;ro=this._renderer.getRenderTarget(),oo=this._renderer.getActiveCubeFace(),ao=this._renderer.getActiveMipmapLevel(),co=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(t,n,i,l,a),e>0&&this._blur(l,0,0,e),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Ac(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=wc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(ro,oo,ao),this._renderer.xr.enabled=co,t.scissorTest=!1,tr(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Xi||t.mapping===qi?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),ro=this._renderer.getRenderTarget(),oo=this._renderer.getActiveCubeFace(),ao=this._renderer.getActiveMipmapLevel(),co=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:Sn,minFilter:Sn,generateMipmaps:!1,type:Ms,format:un,colorSpace:Yi,depthBuffer:!1},i=bc(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=bc(t,e,n);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=rm(s)),this._blurMaterial=om(s,t,e)}return i}_compileMaterial(t){const e=new ze(this._lodPlanes[0],t);this._renderer.compile(e,so)}_sceneToCubeUV(t,e,n,i,s){const l=new sn(90,1,e,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],d=this._renderer,u=d.autoClear,p=d.toneMapping;d.getClearColor(Sc),d.toneMapping=Jn,d.autoClear=!1,d.state.buffers.depth.getReversed()&&(d.setRenderTarget(i),d.clearDepth(),d.setRenderTarget(null));const _=new Oi({name:"PMREM.Background",side:Be,depthWrite:!1,depthTest:!1}),m=new ze(new Vn,_);let f=!1;const v=t.background;v?v.isColor&&(_.color.copy(v),t.background=null,f=!0):(_.color.copy(Sc),f=!0);for(let S=0;S<6;S++){const x=S%3;x===0?(l.up.set(0,c[S],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x+h[S],s.y,s.z)):x===1?(l.up.set(0,0,c[S]),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y+h[S],s.z)):(l.up.set(0,c[S],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y,s.z+h[S]));const w=this._cubeSize;tr(i,x*w,S>2?w:0,w,w),d.setRenderTarget(i),f&&d.render(m,l),d.render(t,l)}m.geometry.dispose(),m.material.dispose(),d.toneMapping=p,d.autoClear=u,t.background=v}_textureToCubeUV(t,e){const n=this._renderer,i=t.mapping===Xi||t.mapping===qi;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=Ac()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=wc());const s=i?this._cubemapMaterial:this._equirectMaterial,o=new ze(this._lodPlanes[0],s),a=s.uniforms;a.envMap.value=t;const l=this._cubeSize;tr(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(o,so)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const i=this._lodPlanes.length;for(let s=1;s<i;s++){const o=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),a=Ec[(i-s-1)%Ec.length];this._blur(t,s-1,s,o,a)}e.autoClear=n}_blur(t,e,n,i,s){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,i,"latitudinal",s),this._halfBlur(o,t,n,n,i,"longitudinal",s)}_halfBlur(t,e,n,i,s,o,a){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,d=new ze(this._lodPlanes[i],c),u=c.uniforms,p=this._sizeLods[n]-1,g=isFinite(s)?Math.PI/(2*p):2*Math.PI/(2*pi-1),_=s/g,m=isFinite(s)?1+Math.floor(h*_):pi;m>pi&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${pi}`);const f=[];let v=0;for(let R=0;R<pi;++R){const L=R/_,b=Math.exp(-L*L/2);f.push(b),R===0?v+=b:R<m&&(v+=2*b)}for(let R=0;R<f.length;R++)f[R]=f[R]/v;u.envMap.value=t.texture,u.samples.value=m,u.weights.value=f,u.latitudinal.value=o==="latitudinal",a&&(u.poleAxis.value=a);const{_lodMax:S}=this;u.dTheta.value=g,u.mipInt.value=S-n;const x=this._sizeLods[i],w=3*x*(i>S-zi?i-S+zi:0),A=4*(this._cubeSize-x);tr(e,w,A,3*x,2*x),l.setRenderTarget(e),l.render(d,so)}}function rm(r){const t=[],e=[],n=[];let i=r;const s=r-zi+1+Mc.length;for(let o=0;o<s;o++){const a=Math.pow(2,i);e.push(a);let l=1/a;o>r-zi?l=Mc[o-r+zi-1]:o===0&&(l=0),n.push(l);const c=1/(a-2),h=-c,d=1+c,u=[h,h,d,h,d,d,h,h,d,d,h,d],p=6,g=6,_=3,m=2,f=1,v=new Float32Array(_*g*p),S=new Float32Array(m*g*p),x=new Float32Array(f*g*p);for(let A=0;A<p;A++){const R=A%3*2/3-1,L=A>2?0:-1,b=[R,L,0,R+2/3,L,0,R+2/3,L+1,0,R,L,0,R+2/3,L+1,0,R,L+1,0];v.set(b,_*g*A),S.set(u,m*g*A);const E=[A,A,A,A,A,A];x.set(E,f*g*A)}const w=new on;w.setAttribute("position",new Tn(v,_)),w.setAttribute("uv",new Tn(S,m)),w.setAttribute("faceIndex",new Tn(x,f)),t.push(w),i>zi&&i--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function bc(r,t,e){const n=new xi(r,t,e);return n.texture.mapping=Tr,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function tr(r,t,e,n,i){r.viewport.set(t,e,n,i),r.scissor.set(t,e,n,i)}function om(r,t,e){const n=new Float32Array(pi),i=new V(0,1,0);return new ti({name:"SphericalGaussianBlur",defines:{n:pi,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${r}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:Aa(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Kn,depthTest:!1,depthWrite:!1})}function wc(){return new ti({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Aa(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Kn,depthTest:!1,depthWrite:!1})}function Ac(){return new ti({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Aa(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Kn,depthTest:!1,depthWrite:!1})}function Aa(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function am(r){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){const l=a.mapping,c=l===No||l===Uo,h=l===Xi||l===qi;if(c||h){let d=t.get(a);const u=d!==void 0?d.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==u)return e===null&&(e=new Tc(r)),d=c?e.fromEquirectangular(a,d):e.fromCubemap(a,d),d.texture.pmremVersion=a.pmremVersion,t.set(a,d),d.texture;if(d!==void 0)return d.texture;{const p=a.image;return c&&p&&p.height>0||h&&p&&i(p)?(e===null&&(e=new Tc(r)),d=c?e.fromEquirectangular(a):e.fromCubemap(a),d.texture.pmremVersion=a.pmremVersion,t.set(a,d),a.addEventListener("dispose",s),d.texture):null}}}return a}function i(a){let l=0;const c=6;for(let h=0;h<c;h++)a[h]!==void 0&&l++;return l===c}function s(a){const l=a.target;l.removeEventListener("dispose",s);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:o}}function cm(r){const t={};function e(n){if(t[n]!==void 0)return t[n];let i;switch(n){case"WEBGL_depth_texture":i=r.getExtension("WEBGL_depth_texture")||r.getExtension("MOZ_WEBGL_depth_texture")||r.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=r.getExtension("EXT_texture_filter_anisotropic")||r.getExtension("MOZ_EXT_texture_filter_anisotropic")||r.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=r.getExtension("WEBGL_compressed_texture_s3tc")||r.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||r.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=r.getExtension("WEBGL_compressed_texture_pvrtc")||r.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=r.getExtension(n)}return t[n]=i,i}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const i=e(n);return i===null&&Vi("THREE.WebGLRenderer: "+n+" extension not supported."),i}}}function lm(r,t,e,n){const i={},s=new WeakMap;function o(d){const u=d.target;u.index!==null&&t.remove(u.index);for(const g in u.attributes)t.remove(u.attributes[g]);u.removeEventListener("dispose",o),delete i[u.id];const p=s.get(u);p&&(t.remove(p),s.delete(u)),n.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,e.memory.geometries--}function a(d,u){return i[u.id]===!0||(u.addEventListener("dispose",o),i[u.id]=!0,e.memory.geometries++),u}function l(d){const u=d.attributes;for(const p in u)t.update(u[p],r.ARRAY_BUFFER)}function c(d){const u=[],p=d.index,g=d.attributes.position;let _=0;if(p!==null){const v=p.array;_=p.version;for(let S=0,x=v.length;S<x;S+=3){const w=v[S+0],A=v[S+1],R=v[S+2];u.push(w,A,A,R,R,w)}}else if(g!==void 0){const v=g.array;_=g.version;for(let S=0,x=v.length/3-1;S<x;S+=3){const w=S+0,A=S+1,R=S+2;u.push(w,A,A,R,R,w)}}else return;const m=new(Xl(u)?Kl:jl)(u,1);m.version=_;const f=s.get(d);f&&t.remove(f),s.set(d,m)}function h(d){const u=s.get(d);if(u){const p=d.index;p!==null&&u.version<p.version&&c(d)}else c(d);return s.get(d)}return{get:a,update:l,getWireframeAttribute:h}}function hm(r,t,e){let n;function i(u){n=u}let s,o;function a(u){s=u.type,o=u.bytesPerElement}function l(u,p){r.drawElements(n,p,s,u*o),e.update(p,n,1)}function c(u,p,g){g!==0&&(r.drawElementsInstanced(n,p,s,u*o,g),e.update(p,n,g))}function h(u,p,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,p,0,s,u,0,g);let m=0;for(let f=0;f<g;f++)m+=p[f];e.update(m,n,1)}function d(u,p,g,_){if(g===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let f=0;f<u.length;f++)c(u[f]/o,p[f],_[f]);else{m.multiDrawElementsInstancedWEBGL(n,p,0,s,u,0,_,0,g);let f=0;for(let v=0;v<g;v++)f+=p[v]*_[v];e.update(f,n,1)}}this.setMode=i,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=d}function um(r){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(s,o,a){switch(e.calls++,o){case r.TRIANGLES:e.triangles+=a*(s/3);break;case r.LINES:e.lines+=a*(s/2);break;case r.LINE_STRIP:e.lines+=a*(s-1);break;case r.LINE_LOOP:e.lines+=a*s;break;case r.POINTS:e.points+=a*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function i(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:i,update:n}}function dm(r,t,e){const n=new WeakMap,i=new de;function s(o,a,l){const c=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,d=h!==void 0?h.length:0;let u=n.get(a);if(u===void 0||u.count!==d){let E=function(){L.dispose(),n.delete(a),a.removeEventListener("dispose",E)};var p=E;u!==void 0&&u.texture.dispose();const g=a.morphAttributes.position!==void 0,_=a.morphAttributes.normal!==void 0,m=a.morphAttributes.color!==void 0,f=a.morphAttributes.position||[],v=a.morphAttributes.normal||[],S=a.morphAttributes.color||[];let x=0;g===!0&&(x=1),_===!0&&(x=2),m===!0&&(x=3);let w=a.attributes.position.count*x,A=1;w>t.maxTextureSize&&(A=Math.ceil(w/t.maxTextureSize),w=t.maxTextureSize);const R=new Float32Array(w*A*4*d),L=new ql(R,w,A,d);L.type=kn,L.needsUpdate=!0;const b=x*4;for(let P=0;P<d;P++){const H=f[P],I=v[P],F=S[P],O=w*A*4*P;for(let N=0;N<H.count;N++){const $=N*b;g===!0&&(i.fromBufferAttribute(H,N),R[O+$+0]=i.x,R[O+$+1]=i.y,R[O+$+2]=i.z,R[O+$+3]=0),_===!0&&(i.fromBufferAttribute(I,N),R[O+$+4]=i.x,R[O+$+5]=i.y,R[O+$+6]=i.z,R[O+$+7]=0),m===!0&&(i.fromBufferAttribute(F,N),R[O+$+8]=i.x,R[O+$+9]=i.y,R[O+$+10]=i.z,R[O+$+11]=F.itemSize===4?i.w:1)}}u={count:d,texture:L,size:new Kt(w,A)},n.set(a,u),a.addEventListener("dispose",E)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(r,"morphTexture",o.morphTexture,e);else{let g=0;for(let m=0;m<c.length;m++)g+=c[m];const _=a.morphTargetsRelative?1:1-g;l.getUniforms().setValue(r,"morphTargetBaseInfluence",_),l.getUniforms().setValue(r,"morphTargetInfluences",c)}l.getUniforms().setValue(r,"morphTargetsTexture",u.texture,e),l.getUniforms().setValue(r,"morphTargetsTextureSize",u.size)}return{update:s}}function fm(r,t,e,n){let i=new WeakMap;function s(l){const c=n.render.frame,h=l.geometry,d=t.get(l,h);if(i.get(d)!==c&&(t.update(d),i.set(d,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),i.get(l)!==c&&(e.update(l.instanceMatrix,r.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,r.ARRAY_BUFFER),i.set(l,c))),l.isSkinnedMesh){const u=l.skeleton;i.get(u)!==c&&(u.update(),i.set(u,c))}return d}function o(){i=new WeakMap}function a(l){const c=l.target;c.removeEventListener("dispose",a),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:s,dispose:o}}const oh=new We,Rc=new nh(1,1),ah=new ql,ch=new zu,lh=new th,Cc=[],Pc=[],Ic=new Float32Array(16),Lc=new Float32Array(9),Dc=new Float32Array(4);function Ji(r,t,e){const n=r[0];if(n<=0||n>0)return r;const i=t*e;let s=Cc[i];if(s===void 0&&(s=new Float32Array(i),Cc[i]=s),t!==0){n.toArray(s,0);for(let o=1,a=0;o!==t;++o)a+=e,r[o].toArray(s,a)}return s}function Se(r,t){if(r.length!==t.length)return!1;for(let e=0,n=r.length;e<n;e++)if(r[e]!==t[e])return!1;return!0}function Ee(r,t){for(let e=0,n=t.length;e<n;e++)r[e]=t[e]}function Ar(r,t){let e=Pc[t];e===void 0&&(e=new Int32Array(t),Pc[t]=e);for(let n=0;n!==t;++n)e[n]=r.allocateTextureUnit();return e}function pm(r,t){const e=this.cache;e[0]!==t&&(r.uniform1f(this.addr,t),e[0]=t)}function mm(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(r.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Se(e,t))return;r.uniform2fv(this.addr,t),Ee(e,t)}}function gm(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(r.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(r.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Se(e,t))return;r.uniform3fv(this.addr,t),Ee(e,t)}}function _m(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(r.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Se(e,t))return;r.uniform4fv(this.addr,t),Ee(e,t)}}function vm(r,t){const e=this.cache,n=t.elements;if(n===void 0){if(Se(e,t))return;r.uniformMatrix2fv(this.addr,!1,t),Ee(e,t)}else{if(Se(e,n))return;Dc.set(n),r.uniformMatrix2fv(this.addr,!1,Dc),Ee(e,n)}}function xm(r,t){const e=this.cache,n=t.elements;if(n===void 0){if(Se(e,t))return;r.uniformMatrix3fv(this.addr,!1,t),Ee(e,t)}else{if(Se(e,n))return;Lc.set(n),r.uniformMatrix3fv(this.addr,!1,Lc),Ee(e,n)}}function ym(r,t){const e=this.cache,n=t.elements;if(n===void 0){if(Se(e,t))return;r.uniformMatrix4fv(this.addr,!1,t),Ee(e,t)}else{if(Se(e,n))return;Ic.set(n),r.uniformMatrix4fv(this.addr,!1,Ic),Ee(e,n)}}function Mm(r,t){const e=this.cache;e[0]!==t&&(r.uniform1i(this.addr,t),e[0]=t)}function Sm(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(r.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Se(e,t))return;r.uniform2iv(this.addr,t),Ee(e,t)}}function Em(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(r.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Se(e,t))return;r.uniform3iv(this.addr,t),Ee(e,t)}}function Tm(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(r.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Se(e,t))return;r.uniform4iv(this.addr,t),Ee(e,t)}}function bm(r,t){const e=this.cache;e[0]!==t&&(r.uniform1ui(this.addr,t),e[0]=t)}function wm(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(r.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Se(e,t))return;r.uniform2uiv(this.addr,t),Ee(e,t)}}function Am(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(r.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Se(e,t))return;r.uniform3uiv(this.addr,t),Ee(e,t)}}function Rm(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(r.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Se(e,t))return;r.uniform4uiv(this.addr,t),Ee(e,t)}}function Cm(r,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i);let s;this.type===r.SAMPLER_2D_SHADOW?(Rc.compareFunction=Wl,s=Rc):s=oh,e.setTexture2D(t||s,i)}function Pm(r,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),e.setTexture3D(t||ch,i)}function Im(r,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),e.setTextureCube(t||lh,i)}function Lm(r,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),e.setTexture2DArray(t||ah,i)}function Dm(r){switch(r){case 5126:return pm;case 35664:return mm;case 35665:return gm;case 35666:return _m;case 35674:return vm;case 35675:return xm;case 35676:return ym;case 5124:case 35670:return Mm;case 35667:case 35671:return Sm;case 35668:case 35672:return Em;case 35669:case 35673:return Tm;case 5125:return bm;case 36294:return wm;case 36295:return Am;case 36296:return Rm;case 35678:case 36198:case 36298:case 36306:case 35682:return Cm;case 35679:case 36299:case 36307:return Pm;case 35680:case 36300:case 36308:case 36293:return Im;case 36289:case 36303:case 36311:case 36292:return Lm}}function Nm(r,t){r.uniform1fv(this.addr,t)}function Um(r,t){const e=Ji(t,this.size,2);r.uniform2fv(this.addr,e)}function Fm(r,t){const e=Ji(t,this.size,3);r.uniform3fv(this.addr,e)}function Om(r,t){const e=Ji(t,this.size,4);r.uniform4fv(this.addr,e)}function zm(r,t){const e=Ji(t,this.size,4);r.uniformMatrix2fv(this.addr,!1,e)}function Bm(r,t){const e=Ji(t,this.size,9);r.uniformMatrix3fv(this.addr,!1,e)}function km(r,t){const e=Ji(t,this.size,16);r.uniformMatrix4fv(this.addr,!1,e)}function Vm(r,t){r.uniform1iv(this.addr,t)}function Gm(r,t){r.uniform2iv(this.addr,t)}function Hm(r,t){r.uniform3iv(this.addr,t)}function Wm(r,t){r.uniform4iv(this.addr,t)}function Xm(r,t){r.uniform1uiv(this.addr,t)}function qm(r,t){r.uniform2uiv(this.addr,t)}function Ym(r,t){r.uniform3uiv(this.addr,t)}function $m(r,t){r.uniform4uiv(this.addr,t)}function Zm(r,t,e){const n=this.cache,i=t.length,s=Ar(e,i);Se(n,s)||(r.uniform1iv(this.addr,s),Ee(n,s));for(let o=0;o!==i;++o)e.setTexture2D(t[o]||oh,s[o])}function jm(r,t,e){const n=this.cache,i=t.length,s=Ar(e,i);Se(n,s)||(r.uniform1iv(this.addr,s),Ee(n,s));for(let o=0;o!==i;++o)e.setTexture3D(t[o]||ch,s[o])}function Km(r,t,e){const n=this.cache,i=t.length,s=Ar(e,i);Se(n,s)||(r.uniform1iv(this.addr,s),Ee(n,s));for(let o=0;o!==i;++o)e.setTextureCube(t[o]||lh,s[o])}function Jm(r,t,e){const n=this.cache,i=t.length,s=Ar(e,i);Se(n,s)||(r.uniform1iv(this.addr,s),Ee(n,s));for(let o=0;o!==i;++o)e.setTexture2DArray(t[o]||ah,s[o])}function Qm(r){switch(r){case 5126:return Nm;case 35664:return Um;case 35665:return Fm;case 35666:return Om;case 35674:return zm;case 35675:return Bm;case 35676:return km;case 5124:case 35670:return Vm;case 35667:case 35671:return Gm;case 35668:case 35672:return Hm;case 35669:case 35673:return Wm;case 5125:return Xm;case 36294:return qm;case 36295:return Ym;case 36296:return $m;case 35678:case 36198:case 36298:case 36306:case 35682:return Zm;case 35679:case 36299:case 36307:return jm;case 35680:case 36300:case 36308:case 36293:return Km;case 36289:case 36303:case 36311:case 36292:return Jm}}class tg{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=Dm(e.type)}}class eg{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Qm(e.type)}}class ng{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const i=this.seq;for(let s=0,o=i.length;s!==o;++s){const a=i[s];a.setValue(t,e[a.id],n)}}}const lo=/(\w+)(\])?(\[|\.)?/g;function Nc(r,t){r.seq.push(t),r.map[t.id]=t}function ig(r,t,e){const n=r.name,i=n.length;for(lo.lastIndex=0;;){const s=lo.exec(n),o=lo.lastIndex;let a=s[1];const l=s[2]==="]",c=s[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===i){Nc(e,c===void 0?new tg(a,r,t):new eg(a,r,t));break}else{let d=e.map[a];d===void 0&&(d=new ng(a),Nc(e,d)),e=d}}}class fr{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let i=0;i<n;++i){const s=t.getActiveUniform(e,i),o=t.getUniformLocation(e,s.name);ig(s,o,this)}}setValue(t,e,n,i){const s=this.map[e];s!==void 0&&s.setValue(t,n,i)}setOptional(t,e,n){const i=e[n];i!==void 0&&this.setValue(t,n,i)}static upload(t,e,n,i){for(let s=0,o=e.length;s!==o;++s){const a=e[s],l=n[a.id];l.needsUpdate!==!1&&a.setValue(t,l.value,i)}}static seqWithValue(t,e){const n=[];for(let i=0,s=t.length;i!==s;++i){const o=t[i];o.id in e&&n.push(o)}return n}}function Uc(r,t,e){const n=r.createShader(t);return r.shaderSource(n,e),r.compileShader(n),n}const sg=37297;let rg=0;function og(r,t){const e=r.split(`
`),n=[],i=Math.max(t-6,0),s=Math.min(t+6,e.length);for(let o=i;o<s;o++){const a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}const Fc=new zt;function ag(r){Yt._getMatrix(Fc,Yt.workingColorSpace,r);const t=`mat3( ${Fc.elements.map(e=>e.toFixed(4))} )`;switch(Yt.getTransfer(r)){case mr:return[t,"LinearTransferOETF"];case ne:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",r),[t,"LinearTransferOETF"]}}function Oc(r,t,e){const n=r.getShaderParameter(t,r.COMPILE_STATUS),s=(r.getShaderInfoLog(t)||"").trim();if(n&&s==="")return"";const o=/ERROR: 0:(\d+)/.exec(s);if(o){const a=parseInt(o[1]);return e.toUpperCase()+`

`+s+`

`+og(r.getShaderSource(t),a)}else return s}function cg(r,t){const e=ag(t);return[`vec4 ${r}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function lg(r,t){let e;switch(t){case du:e="Linear";break;case fu:e="Reinhard";break;case pu:e="Cineon";break;case mu:e="ACESFilmic";break;case _u:e="AgX";break;case vu:e="Neutral";break;case gu:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+r+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const er=new V;function hg(){Yt.getLuminanceCoefficients(er);const r=er.x.toFixed(4),t=er.y.toFixed(4),e=er.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${r}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function ug(r){return[r.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",r.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(ds).join(`
`)}function dg(r){const t=[];for(const e in r){const n=r[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function fg(r,t){const e={},n=r.getProgramParameter(t,r.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const s=r.getActiveAttrib(t,i),o=s.name;let a=1;s.type===r.FLOAT_MAT2&&(a=2),s.type===r.FLOAT_MAT3&&(a=3),s.type===r.FLOAT_MAT4&&(a=4),e[o]={type:s.type,location:r.getAttribLocation(t,o),locationSize:a}}return e}function ds(r){return r!==""}function zc(r,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return r.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Bc(r,t){return r.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const pg=/^[ \t]*#include +<([\w\d./]+)>/gm;function ua(r){return r.replace(pg,gg)}const mg=new Map;function gg(r,t){let e=Bt[t];if(e===void 0){const n=mg.get(t);if(n!==void 0)e=Bt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return ua(e)}const _g=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function kc(r){return r.replace(_g,vg)}function vg(r,t,e,n){let i="";for(let s=parseInt(t);s<parseInt(e);s++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return i}function Vc(r){let t=`precision ${r.precision} float;
	precision ${r.precision} int;
	precision ${r.precision} sampler2D;
	precision ${r.precision} samplerCube;
	precision ${r.precision} sampler3D;
	precision ${r.precision} sampler2DArray;
	precision ${r.precision} sampler2DShadow;
	precision ${r.precision} samplerCubeShadow;
	precision ${r.precision} sampler2DArrayShadow;
	precision ${r.precision} isampler2D;
	precision ${r.precision} isampler3D;
	precision ${r.precision} isamplerCube;
	precision ${r.precision} isampler2DArray;
	precision ${r.precision} usampler2D;
	precision ${r.precision} usampler3D;
	precision ${r.precision} usamplerCube;
	precision ${r.precision} usampler2DArray;
	`;return r.precision==="highp"?t+=`
#define HIGH_PRECISION`:r.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:r.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function xg(r){let t="SHADOWMAP_TYPE_BASIC";return r.shadowMapType===Ll?t="SHADOWMAP_TYPE_PCF":r.shadowMapType===Xh?t="SHADOWMAP_TYPE_PCF_SOFT":r.shadowMapType===zn&&(t="SHADOWMAP_TYPE_VSM"),t}function yg(r){let t="ENVMAP_TYPE_CUBE";if(r.envMap)switch(r.envMapMode){case Xi:case qi:t="ENVMAP_TYPE_CUBE";break;case Tr:t="ENVMAP_TYPE_CUBE_UV";break}return t}function Mg(r){let t="ENVMAP_MODE_REFLECTION";return r.envMap&&r.envMapMode===qi&&(t="ENVMAP_MODE_REFRACTION"),t}function Sg(r){let t="ENVMAP_BLENDING_NONE";if(r.envMap)switch(r.combine){case Dl:t="ENVMAP_BLENDING_MULTIPLY";break;case hu:t="ENVMAP_BLENDING_MIX";break;case uu:t="ENVMAP_BLENDING_ADD";break}return t}function Eg(r){const t=r.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function Tg(r,t,e,n){const i=r.getContext(),s=e.defines;let o=e.vertexShader,a=e.fragmentShader;const l=xg(e),c=yg(e),h=Mg(e),d=Sg(e),u=Eg(e),p=ug(e),g=dg(s),_=i.createProgram();let m,f,v=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(ds).join(`
`),m.length>0&&(m+=`
`),f=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(ds).join(`
`),f.length>0&&(f+=`
`)):(m=[Vc(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reversedDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(ds).join(`
`),f=[Vc(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+d:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reversedDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Jn?"#define TONE_MAPPING":"",e.toneMapping!==Jn?Bt.tonemapping_pars_fragment:"",e.toneMapping!==Jn?lg("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Bt.colorspace_pars_fragment,cg("linearToOutputTexel",e.outputColorSpace),hg(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(ds).join(`
`)),o=ua(o),o=zc(o,e),o=Bc(o,e),a=ua(a),a=zc(a,e),a=Bc(a,e),o=kc(o),a=kc(a),e.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,f=["#define varying in",e.glslVersion===Za?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Za?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);const S=v+m+o,x=v+f+a,w=Uc(i,i.VERTEX_SHADER,S),A=Uc(i,i.FRAGMENT_SHADER,x);i.attachShader(_,w),i.attachShader(_,A),e.index0AttributeName!==void 0?i.bindAttribLocation(_,0,e.index0AttributeName):e.morphTargets===!0&&i.bindAttribLocation(_,0,"position"),i.linkProgram(_);function R(P){if(r.debug.checkShaderErrors){const H=i.getProgramInfoLog(_)||"",I=i.getShaderInfoLog(w)||"",F=i.getShaderInfoLog(A)||"",O=H.trim(),N=I.trim(),$=F.trim();let k=!0,K=!0;if(i.getProgramParameter(_,i.LINK_STATUS)===!1)if(k=!1,typeof r.debug.onShaderError=="function")r.debug.onShaderError(i,_,w,A);else{const ot=Oc(i,w,"vertex"),pt=Oc(i,A,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(_,i.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+O+`
`+ot+`
`+pt)}else O!==""?console.warn("THREE.WebGLProgram: Program Info Log:",O):(N===""||$==="")&&(K=!1);K&&(P.diagnostics={runnable:k,programLog:O,vertexShader:{log:N,prefix:m},fragmentShader:{log:$,prefix:f}})}i.deleteShader(w),i.deleteShader(A),L=new fr(i,_),b=fg(i,_)}let L;this.getUniforms=function(){return L===void 0&&R(this),L};let b;this.getAttributes=function(){return b===void 0&&R(this),b};let E=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return E===!1&&(E=i.getProgramParameter(_,sg)),E},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(_),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=rg++,this.cacheKey=t,this.usedTimes=1,this.program=_,this.vertexShader=w,this.fragmentShader=A,this}let bg=0;class wg{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,i=this._getShaderStage(e),s=this._getShaderStage(n),o=this._getShaderCacheForMaterial(t);return o.has(i)===!1&&(o.add(i),i.usedTimes++),o.has(s)===!1&&(o.add(s),s.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new Ag(t),e.set(t,n)),n}}class Ag{constructor(t){this.id=bg++,this.code=t,this.usedTimes=0}}function Rg(r,t,e,n,i,s,o){const a=new $l,l=new wg,c=new Set,h=[],d=i.logarithmicDepthBuffer,u=i.vertexTextures;let p=i.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(b){return c.add(b),b===0?"uv":`uv${b}`}function m(b,E,P,H,I){const F=H.fog,O=I.geometry,N=b.isMeshStandardMaterial?H.environment:null,$=(b.isMeshStandardMaterial?e:t).get(b.envMap||N),k=$&&$.mapping===Tr?$.image.height:null,K=g[b.type];b.precision!==null&&(p=i.getMaxPrecision(b.precision),p!==b.precision&&console.warn("THREE.WebGLProgram.getParameters:",b.precision,"not supported, using",p,"instead."));const ot=O.morphAttributes.position||O.morphAttributes.normal||O.morphAttributes.color,pt=ot!==void 0?ot.length:0;let st=0;O.morphAttributes.position!==void 0&&(st=1),O.morphAttributes.normal!==void 0&&(st=2),O.morphAttributes.color!==void 0&&(st=3);let $t,Xt,Z,lt;if(K){const Jt=yn[K];$t=Jt.vertexShader,Xt=Jt.fragmentShader}else $t=b.vertexShader,Xt=b.fragmentShader,l.update(b),Z=l.getVertexShaderID(b),lt=l.getFragmentShaderID(b);const rt=r.getRenderTarget(),Pt=r.state.buffers.depth.getReversed(),It=I.isInstancedMesh===!0,Ut=I.isBatchedMesh===!0,pe=!!b.map,Wt=!!b.matcap,D=!!$,se=!!b.aoMap,Rt=!!b.lightMap,Zt=!!b.bumpMap,wt=!!b.normalMap,ce=!!b.displacementMap,xt=!!b.emissiveMap,kt=!!b.metalnessMap,Te=!!b.roughnessMap,me=b.anisotropy>0,C=b.clearcoat>0,y=b.dispersion>0,G=b.iridescence>0,j=b.sheen>0,Q=b.transmission>0,Y=me&&!!b.anisotropyMap,bt=C&&!!b.clearcoatMap,at=C&&!!b.clearcoatNormalMap,St=C&&!!b.clearcoatRoughnessMap,Et=G&&!!b.iridescenceMap,nt=G&&!!b.iridescenceThicknessMap,ft=j&&!!b.sheenColorMap,Dt=j&&!!b.sheenRoughnessMap,Tt=!!b.specularMap,ut=!!b.specularColorMap,Ot=!!b.specularIntensityMap,U=Q&&!!b.transmissionMap,it=Q&&!!b.thicknessMap,ct=!!b.gradientMap,vt=!!b.alphaMap,tt=b.alphaTest>0,J=!!b.alphaHash,Mt=!!b.extensions;let Ft=Jn;b.toneMapped&&(rt===null||rt.isXRRenderTarget===!0)&&(Ft=r.toneMapping);const re={shaderID:K,shaderType:b.type,shaderName:b.name,vertexShader:$t,fragmentShader:Xt,defines:b.defines,customVertexShaderID:Z,customFragmentShaderID:lt,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:p,batching:Ut,batchingColor:Ut&&I._colorsTexture!==null,instancing:It,instancingColor:It&&I.instanceColor!==null,instancingMorph:It&&I.morphTexture!==null,supportsVertexTextures:u,outputColorSpace:rt===null?r.outputColorSpace:rt.isXRRenderTarget===!0?rt.texture.colorSpace:Yi,alphaToCoverage:!!b.alphaToCoverage,map:pe,matcap:Wt,envMap:D,envMapMode:D&&$.mapping,envMapCubeUVHeight:k,aoMap:se,lightMap:Rt,bumpMap:Zt,normalMap:wt,displacementMap:u&&ce,emissiveMap:xt,normalMapObjectSpace:wt&&b.normalMapType===Su,normalMapTangentSpace:wt&&b.normalMapType===Hl,metalnessMap:kt,roughnessMap:Te,anisotropy:me,anisotropyMap:Y,clearcoat:C,clearcoatMap:bt,clearcoatNormalMap:at,clearcoatRoughnessMap:St,dispersion:y,iridescence:G,iridescenceMap:Et,iridescenceThicknessMap:nt,sheen:j,sheenColorMap:ft,sheenRoughnessMap:Dt,specularMap:Tt,specularColorMap:ut,specularIntensityMap:Ot,transmission:Q,transmissionMap:U,thicknessMap:it,gradientMap:ct,opaque:b.transparent===!1&&b.blending===ki&&b.alphaToCoverage===!1,alphaMap:vt,alphaTest:tt,alphaHash:J,combine:b.combine,mapUv:pe&&_(b.map.channel),aoMapUv:se&&_(b.aoMap.channel),lightMapUv:Rt&&_(b.lightMap.channel),bumpMapUv:Zt&&_(b.bumpMap.channel),normalMapUv:wt&&_(b.normalMap.channel),displacementMapUv:ce&&_(b.displacementMap.channel),emissiveMapUv:xt&&_(b.emissiveMap.channel),metalnessMapUv:kt&&_(b.metalnessMap.channel),roughnessMapUv:Te&&_(b.roughnessMap.channel),anisotropyMapUv:Y&&_(b.anisotropyMap.channel),clearcoatMapUv:bt&&_(b.clearcoatMap.channel),clearcoatNormalMapUv:at&&_(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:St&&_(b.clearcoatRoughnessMap.channel),iridescenceMapUv:Et&&_(b.iridescenceMap.channel),iridescenceThicknessMapUv:nt&&_(b.iridescenceThicknessMap.channel),sheenColorMapUv:ft&&_(b.sheenColorMap.channel),sheenRoughnessMapUv:Dt&&_(b.sheenRoughnessMap.channel),specularMapUv:Tt&&_(b.specularMap.channel),specularColorMapUv:ut&&_(b.specularColorMap.channel),specularIntensityMapUv:Ot&&_(b.specularIntensityMap.channel),transmissionMapUv:U&&_(b.transmissionMap.channel),thicknessMapUv:it&&_(b.thicknessMap.channel),alphaMapUv:vt&&_(b.alphaMap.channel),vertexTangents:!!O.attributes.tangent&&(wt||me),vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!O.attributes.color&&O.attributes.color.itemSize===4,pointsUvs:I.isPoints===!0&&!!O.attributes.uv&&(pe||vt),fog:!!F,useFog:b.fog===!0,fogExp2:!!F&&F.isFogExp2,flatShading:b.flatShading===!0&&b.wireframe===!1,sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:Pt,skinning:I.isSkinnedMesh===!0,morphTargets:O.morphAttributes.position!==void 0,morphNormals:O.morphAttributes.normal!==void 0,morphColors:O.morphAttributes.color!==void 0,morphTargetsCount:pt,morphTextureStride:st,numDirLights:E.directional.length,numPointLights:E.point.length,numSpotLights:E.spot.length,numSpotLightMaps:E.spotLightMap.length,numRectAreaLights:E.rectArea.length,numHemiLights:E.hemi.length,numDirLightShadows:E.directionalShadowMap.length,numPointLightShadows:E.pointShadowMap.length,numSpotLightShadows:E.spotShadowMap.length,numSpotLightShadowsWithMaps:E.numSpotLightShadowsWithMaps,numLightProbes:E.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:b.dithering,shadowMapEnabled:r.shadowMap.enabled&&P.length>0,shadowMapType:r.shadowMap.type,toneMapping:Ft,decodeVideoTexture:pe&&b.map.isVideoTexture===!0&&Yt.getTransfer(b.map.colorSpace)===ne,decodeVideoTextureEmissive:xt&&b.emissiveMap.isVideoTexture===!0&&Yt.getTransfer(b.emissiveMap.colorSpace)===ne,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===Bn,flipSided:b.side===Be,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionClipCullDistance:Mt&&b.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Mt&&b.extensions.multiDraw===!0||Ut)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()};return re.vertexUv1s=c.has(1),re.vertexUv2s=c.has(2),re.vertexUv3s=c.has(3),c.clear(),re}function f(b){const E=[];if(b.shaderID?E.push(b.shaderID):(E.push(b.customVertexShaderID),E.push(b.customFragmentShaderID)),b.defines!==void 0)for(const P in b.defines)E.push(P),E.push(b.defines[P]);return b.isRawShaderMaterial===!1&&(v(E,b),S(E,b),E.push(r.outputColorSpace)),E.push(b.customProgramCacheKey),E.join()}function v(b,E){b.push(E.precision),b.push(E.outputColorSpace),b.push(E.envMapMode),b.push(E.envMapCubeUVHeight),b.push(E.mapUv),b.push(E.alphaMapUv),b.push(E.lightMapUv),b.push(E.aoMapUv),b.push(E.bumpMapUv),b.push(E.normalMapUv),b.push(E.displacementMapUv),b.push(E.emissiveMapUv),b.push(E.metalnessMapUv),b.push(E.roughnessMapUv),b.push(E.anisotropyMapUv),b.push(E.clearcoatMapUv),b.push(E.clearcoatNormalMapUv),b.push(E.clearcoatRoughnessMapUv),b.push(E.iridescenceMapUv),b.push(E.iridescenceThicknessMapUv),b.push(E.sheenColorMapUv),b.push(E.sheenRoughnessMapUv),b.push(E.specularMapUv),b.push(E.specularColorMapUv),b.push(E.specularIntensityMapUv),b.push(E.transmissionMapUv),b.push(E.thicknessMapUv),b.push(E.combine),b.push(E.fogExp2),b.push(E.sizeAttenuation),b.push(E.morphTargetsCount),b.push(E.morphAttributeCount),b.push(E.numDirLights),b.push(E.numPointLights),b.push(E.numSpotLights),b.push(E.numSpotLightMaps),b.push(E.numHemiLights),b.push(E.numRectAreaLights),b.push(E.numDirLightShadows),b.push(E.numPointLightShadows),b.push(E.numSpotLightShadows),b.push(E.numSpotLightShadowsWithMaps),b.push(E.numLightProbes),b.push(E.shadowMapType),b.push(E.toneMapping),b.push(E.numClippingPlanes),b.push(E.numClipIntersection),b.push(E.depthPacking)}function S(b,E){a.disableAll(),E.supportsVertexTextures&&a.enable(0),E.instancing&&a.enable(1),E.instancingColor&&a.enable(2),E.instancingMorph&&a.enable(3),E.matcap&&a.enable(4),E.envMap&&a.enable(5),E.normalMapObjectSpace&&a.enable(6),E.normalMapTangentSpace&&a.enable(7),E.clearcoat&&a.enable(8),E.iridescence&&a.enable(9),E.alphaTest&&a.enable(10),E.vertexColors&&a.enable(11),E.vertexAlphas&&a.enable(12),E.vertexUv1s&&a.enable(13),E.vertexUv2s&&a.enable(14),E.vertexUv3s&&a.enable(15),E.vertexTangents&&a.enable(16),E.anisotropy&&a.enable(17),E.alphaHash&&a.enable(18),E.batching&&a.enable(19),E.dispersion&&a.enable(20),E.batchingColor&&a.enable(21),E.gradientMap&&a.enable(22),b.push(a.mask),a.disableAll(),E.fog&&a.enable(0),E.useFog&&a.enable(1),E.flatShading&&a.enable(2),E.logarithmicDepthBuffer&&a.enable(3),E.reversedDepthBuffer&&a.enable(4),E.skinning&&a.enable(5),E.morphTargets&&a.enable(6),E.morphNormals&&a.enable(7),E.morphColors&&a.enable(8),E.premultipliedAlpha&&a.enable(9),E.shadowMapEnabled&&a.enable(10),E.doubleSided&&a.enable(11),E.flipSided&&a.enable(12),E.useDepthPacking&&a.enable(13),E.dithering&&a.enable(14),E.transmission&&a.enable(15),E.sheen&&a.enable(16),E.opaque&&a.enable(17),E.pointsUvs&&a.enable(18),E.decodeVideoTexture&&a.enable(19),E.decodeVideoTextureEmissive&&a.enable(20),E.alphaToCoverage&&a.enable(21),b.push(a.mask)}function x(b){const E=g[b.type];let P;if(E){const H=yn[E];P=Ku.clone(H.uniforms)}else P=b.uniforms;return P}function w(b,E){let P;for(let H=0,I=h.length;H<I;H++){const F=h[H];if(F.cacheKey===E){P=F,++P.usedTimes;break}}return P===void 0&&(P=new Tg(r,E,b,s),h.push(P)),P}function A(b){if(--b.usedTimes===0){const E=h.indexOf(b);h[E]=h[h.length-1],h.pop(),b.destroy()}}function R(b){l.remove(b)}function L(){l.dispose()}return{getParameters:m,getProgramCacheKey:f,getUniforms:x,acquireProgram:w,releaseProgram:A,releaseShaderCache:R,programs:h,dispose:L}}function Cg(){let r=new WeakMap;function t(o){return r.has(o)}function e(o){let a=r.get(o);return a===void 0&&(a={},r.set(o,a)),a}function n(o){r.delete(o)}function i(o,a,l){r.get(o)[a]=l}function s(){r=new WeakMap}return{has:t,get:e,remove:n,update:i,dispose:s}}function Pg(r,t){return r.groupOrder!==t.groupOrder?r.groupOrder-t.groupOrder:r.renderOrder!==t.renderOrder?r.renderOrder-t.renderOrder:r.material.id!==t.material.id?r.material.id-t.material.id:r.z!==t.z?r.z-t.z:r.id-t.id}function Gc(r,t){return r.groupOrder!==t.groupOrder?r.groupOrder-t.groupOrder:r.renderOrder!==t.renderOrder?r.renderOrder-t.renderOrder:r.z!==t.z?t.z-r.z:r.id-t.id}function Hc(){const r=[];let t=0;const e=[],n=[],i=[];function s(){t=0,e.length=0,n.length=0,i.length=0}function o(d,u,p,g,_,m){let f=r[t];return f===void 0?(f={id:d.id,object:d,geometry:u,material:p,groupOrder:g,renderOrder:d.renderOrder,z:_,group:m},r[t]=f):(f.id=d.id,f.object=d,f.geometry=u,f.material=p,f.groupOrder=g,f.renderOrder=d.renderOrder,f.z=_,f.group=m),t++,f}function a(d,u,p,g,_,m){const f=o(d,u,p,g,_,m);p.transmission>0?n.push(f):p.transparent===!0?i.push(f):e.push(f)}function l(d,u,p,g,_,m){const f=o(d,u,p,g,_,m);p.transmission>0?n.unshift(f):p.transparent===!0?i.unshift(f):e.unshift(f)}function c(d,u){e.length>1&&e.sort(d||Pg),n.length>1&&n.sort(u||Gc),i.length>1&&i.sort(u||Gc)}function h(){for(let d=t,u=r.length;d<u;d++){const p=r[d];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:e,transmissive:n,transparent:i,init:s,push:a,unshift:l,finish:h,sort:c}}function Ig(){let r=new WeakMap;function t(n,i){const s=r.get(n);let o;return s===void 0?(o=new Hc,r.set(n,[o])):i>=s.length?(o=new Hc,s.push(o)):o=s[i],o}function e(){r=new WeakMap}return{get:t,dispose:e}}function Lg(){const r={};return{get:function(t){if(r[t.id]!==void 0)return r[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new V,color:new Ht};break;case"SpotLight":e={position:new V,direction:new V,color:new Ht,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new V,color:new Ht,distance:0,decay:0};break;case"HemisphereLight":e={direction:new V,skyColor:new Ht,groundColor:new Ht};break;case"RectAreaLight":e={color:new Ht,position:new V,halfWidth:new V,halfHeight:new V};break}return r[t.id]=e,e}}}function Dg(){const r={};return{get:function(t){if(r[t.id]!==void 0)return r[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Kt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Kt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Kt,shadowCameraNear:1,shadowCameraFar:1e3};break}return r[t.id]=e,e}}}let Ng=0;function Ug(r,t){return(t.castShadow?2:0)-(r.castShadow?2:0)+(t.map?1:0)-(r.map?1:0)}function Fg(r){const t=new Lg,e=Dg(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new V);const i=new V,s=new fe,o=new fe;function a(c){let h=0,d=0,u=0;for(let b=0;b<9;b++)n.probe[b].set(0,0,0);let p=0,g=0,_=0,m=0,f=0,v=0,S=0,x=0,w=0,A=0,R=0;c.sort(Ug);for(let b=0,E=c.length;b<E;b++){const P=c[b],H=P.color,I=P.intensity,F=P.distance,O=P.shadow&&P.shadow.map?P.shadow.map.texture:null;if(P.isAmbientLight)h+=H.r*I,d+=H.g*I,u+=H.b*I;else if(P.isLightProbe){for(let N=0;N<9;N++)n.probe[N].addScaledVector(P.sh.coefficients[N],I);R++}else if(P.isDirectionalLight){const N=t.get(P);if(N.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const $=P.shadow,k=e.get(P);k.shadowIntensity=$.intensity,k.shadowBias=$.bias,k.shadowNormalBias=$.normalBias,k.shadowRadius=$.radius,k.shadowMapSize=$.mapSize,n.directionalShadow[p]=k,n.directionalShadowMap[p]=O,n.directionalShadowMatrix[p]=P.shadow.matrix,v++}n.directional[p]=N,p++}else if(P.isSpotLight){const N=t.get(P);N.position.setFromMatrixPosition(P.matrixWorld),N.color.copy(H).multiplyScalar(I),N.distance=F,N.coneCos=Math.cos(P.angle),N.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),N.decay=P.decay,n.spot[_]=N;const $=P.shadow;if(P.map&&(n.spotLightMap[w]=P.map,w++,$.updateMatrices(P),P.castShadow&&A++),n.spotLightMatrix[_]=$.matrix,P.castShadow){const k=e.get(P);k.shadowIntensity=$.intensity,k.shadowBias=$.bias,k.shadowNormalBias=$.normalBias,k.shadowRadius=$.radius,k.shadowMapSize=$.mapSize,n.spotShadow[_]=k,n.spotShadowMap[_]=O,x++}_++}else if(P.isRectAreaLight){const N=t.get(P);N.color.copy(H).multiplyScalar(I),N.halfWidth.set(P.width*.5,0,0),N.halfHeight.set(0,P.height*.5,0),n.rectArea[m]=N,m++}else if(P.isPointLight){const N=t.get(P);if(N.color.copy(P.color).multiplyScalar(P.intensity),N.distance=P.distance,N.decay=P.decay,P.castShadow){const $=P.shadow,k=e.get(P);k.shadowIntensity=$.intensity,k.shadowBias=$.bias,k.shadowNormalBias=$.normalBias,k.shadowRadius=$.radius,k.shadowMapSize=$.mapSize,k.shadowCameraNear=$.camera.near,k.shadowCameraFar=$.camera.far,n.pointShadow[g]=k,n.pointShadowMap[g]=O,n.pointShadowMatrix[g]=P.shadow.matrix,S++}n.point[g]=N,g++}else if(P.isHemisphereLight){const N=t.get(P);N.skyColor.copy(P.color).multiplyScalar(I),N.groundColor.copy(P.groundColor).multiplyScalar(I),n.hemi[f]=N,f++}}m>0&&(r.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=ht.LTC_FLOAT_1,n.rectAreaLTC2=ht.LTC_FLOAT_2):(n.rectAreaLTC1=ht.LTC_HALF_1,n.rectAreaLTC2=ht.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=d,n.ambient[2]=u;const L=n.hash;(L.directionalLength!==p||L.pointLength!==g||L.spotLength!==_||L.rectAreaLength!==m||L.hemiLength!==f||L.numDirectionalShadows!==v||L.numPointShadows!==S||L.numSpotShadows!==x||L.numSpotMaps!==w||L.numLightProbes!==R)&&(n.directional.length=p,n.spot.length=_,n.rectArea.length=m,n.point.length=g,n.hemi.length=f,n.directionalShadow.length=v,n.directionalShadowMap.length=v,n.pointShadow.length=S,n.pointShadowMap.length=S,n.spotShadow.length=x,n.spotShadowMap.length=x,n.directionalShadowMatrix.length=v,n.pointShadowMatrix.length=S,n.spotLightMatrix.length=x+w-A,n.spotLightMap.length=w,n.numSpotLightShadowsWithMaps=A,n.numLightProbes=R,L.directionalLength=p,L.pointLength=g,L.spotLength=_,L.rectAreaLength=m,L.hemiLength=f,L.numDirectionalShadows=v,L.numPointShadows=S,L.numSpotShadows=x,L.numSpotMaps=w,L.numLightProbes=R,n.version=Ng++)}function l(c,h){let d=0,u=0,p=0,g=0,_=0;const m=h.matrixWorldInverse;for(let f=0,v=c.length;f<v;f++){const S=c[f];if(S.isDirectionalLight){const x=n.directional[d];x.direction.setFromMatrixPosition(S.matrixWorld),i.setFromMatrixPosition(S.target.matrixWorld),x.direction.sub(i),x.direction.transformDirection(m),d++}else if(S.isSpotLight){const x=n.spot[p];x.position.setFromMatrixPosition(S.matrixWorld),x.position.applyMatrix4(m),x.direction.setFromMatrixPosition(S.matrixWorld),i.setFromMatrixPosition(S.target.matrixWorld),x.direction.sub(i),x.direction.transformDirection(m),p++}else if(S.isRectAreaLight){const x=n.rectArea[g];x.position.setFromMatrixPosition(S.matrixWorld),x.position.applyMatrix4(m),o.identity(),s.copy(S.matrixWorld),s.premultiply(m),o.extractRotation(s),x.halfWidth.set(S.width*.5,0,0),x.halfHeight.set(0,S.height*.5,0),x.halfWidth.applyMatrix4(o),x.halfHeight.applyMatrix4(o),g++}else if(S.isPointLight){const x=n.point[u];x.position.setFromMatrixPosition(S.matrixWorld),x.position.applyMatrix4(m),u++}else if(S.isHemisphereLight){const x=n.hemi[_];x.direction.setFromMatrixPosition(S.matrixWorld),x.direction.transformDirection(m),_++}}}return{setup:a,setupView:l,state:n}}function Wc(r){const t=new Fg(r),e=[],n=[];function i(h){c.camera=h,e.length=0,n.length=0}function s(h){e.push(h)}function o(h){n.push(h)}function a(){t.setup(e)}function l(h){t.setupView(e,h)}const c={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:i,state:c,setupLights:a,setupLightsView:l,pushLight:s,pushShadow:o}}function Og(r){let t=new WeakMap;function e(i,s=0){const o=t.get(i);let a;return o===void 0?(a=new Wc(r),t.set(i,[a])):s>=o.length?(a=new Wc(r),o.push(a)):a=o[s],a}function n(){t=new WeakMap}return{get:e,dispose:n}}const zg=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Bg=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function kg(r,t,e){let n=new Ta;const i=new Kt,s=new Kt,o=new de,a=new ld({depthPacking:Mu}),l=new hd,c={},h=e.maxTextureSize,d={[Qn]:Be,[Be]:Qn,[Bn]:Bn},u=new ti({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Kt},radius:{value:4}},vertexShader:zg,fragmentShader:Bg}),p=u.clone();p.defines.HORIZONTAL_PASS=1;const g=new on;g.setAttribute("position",new Tn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new ze(g,u),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Ll;let f=this.type;this.render=function(A,R,L){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||A.length===0)return;const b=r.getRenderTarget(),E=r.getActiveCubeFace(),P=r.getActiveMipmapLevel(),H=r.state;H.setBlending(Kn),H.buffers.depth.getReversed()?H.buffers.color.setClear(0,0,0,0):H.buffers.color.setClear(1,1,1,1),H.buffers.depth.setTest(!0),H.setScissorTest(!1);const I=f!==zn&&this.type===zn,F=f===zn&&this.type!==zn;for(let O=0,N=A.length;O<N;O++){const $=A[O],k=$.shadow;if(k===void 0){console.warn("THREE.WebGLShadowMap:",$,"has no shadow.");continue}if(k.autoUpdate===!1&&k.needsUpdate===!1)continue;i.copy(k.mapSize);const K=k.getFrameExtents();if(i.multiply(K),s.copy(k.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(s.x=Math.floor(h/K.x),i.x=s.x*K.x,k.mapSize.x=s.x),i.y>h&&(s.y=Math.floor(h/K.y),i.y=s.y*K.y,k.mapSize.y=s.y)),k.map===null||I===!0||F===!0){const pt=this.type!==zn?{minFilter:fn,magFilter:fn}:{};k.map!==null&&k.map.dispose(),k.map=new xi(i.x,i.y,pt),k.map.texture.name=$.name+".shadowMap",k.camera.updateProjectionMatrix()}r.setRenderTarget(k.map),r.clear();const ot=k.getViewportCount();for(let pt=0;pt<ot;pt++){const st=k.getViewport(pt);o.set(s.x*st.x,s.y*st.y,s.x*st.z,s.y*st.w),H.viewport(o),k.updateMatrices($,pt),n=k.getFrustum(),x(R,L,k.camera,$,this.type)}k.isPointLightShadow!==!0&&this.type===zn&&v(k,L),k.needsUpdate=!1}f=this.type,m.needsUpdate=!1,r.setRenderTarget(b,E,P)};function v(A,R){const L=t.update(_);u.defines.VSM_SAMPLES!==A.blurSamples&&(u.defines.VSM_SAMPLES=A.blurSamples,p.defines.VSM_SAMPLES=A.blurSamples,u.needsUpdate=!0,p.needsUpdate=!0),A.mapPass===null&&(A.mapPass=new xi(i.x,i.y)),u.uniforms.shadow_pass.value=A.map.texture,u.uniforms.resolution.value=A.mapSize,u.uniforms.radius.value=A.radius,r.setRenderTarget(A.mapPass),r.clear(),r.renderBufferDirect(R,null,L,u,_,null),p.uniforms.shadow_pass.value=A.mapPass.texture,p.uniforms.resolution.value=A.mapSize,p.uniforms.radius.value=A.radius,r.setRenderTarget(A.map),r.clear(),r.renderBufferDirect(R,null,L,p,_,null)}function S(A,R,L,b){let E=null;const P=L.isPointLight===!0?A.customDistanceMaterial:A.customDepthMaterial;if(P!==void 0)E=P;else if(E=L.isPointLight===!0?l:a,r.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0||R.alphaToCoverage===!0){const H=E.uuid,I=R.uuid;let F=c[H];F===void 0&&(F={},c[H]=F);let O=F[I];O===void 0&&(O=E.clone(),F[I]=O,R.addEventListener("dispose",w)),E=O}if(E.visible=R.visible,E.wireframe=R.wireframe,b===zn?E.side=R.shadowSide!==null?R.shadowSide:R.side:E.side=R.shadowSide!==null?R.shadowSide:d[R.side],E.alphaMap=R.alphaMap,E.alphaTest=R.alphaToCoverage===!0?.5:R.alphaTest,E.map=R.map,E.clipShadows=R.clipShadows,E.clippingPlanes=R.clippingPlanes,E.clipIntersection=R.clipIntersection,E.displacementMap=R.displacementMap,E.displacementScale=R.displacementScale,E.displacementBias=R.displacementBias,E.wireframeLinewidth=R.wireframeLinewidth,E.linewidth=R.linewidth,L.isPointLight===!0&&E.isMeshDistanceMaterial===!0){const H=r.properties.get(E);H.light=L}return E}function x(A,R,L,b,E){if(A.visible===!1)return;if(A.layers.test(R.layers)&&(A.isMesh||A.isLine||A.isPoints)&&(A.castShadow||A.receiveShadow&&E===zn)&&(!A.frustumCulled||n.intersectsObject(A))){A.modelViewMatrix.multiplyMatrices(L.matrixWorldInverse,A.matrixWorld);const I=t.update(A),F=A.material;if(Array.isArray(F)){const O=I.groups;for(let N=0,$=O.length;N<$;N++){const k=O[N],K=F[k.materialIndex];if(K&&K.visible){const ot=S(A,K,b,E);A.onBeforeShadow(r,A,R,L,I,ot,k),r.renderBufferDirect(L,null,I,ot,A,k),A.onAfterShadow(r,A,R,L,I,ot,k)}}}else if(F.visible){const O=S(A,F,b,E);A.onBeforeShadow(r,A,R,L,I,O,null),r.renderBufferDirect(L,null,I,O,A,null),A.onAfterShadow(r,A,R,L,I,O,null)}}const H=A.children;for(let I=0,F=H.length;I<F;I++)x(H[I],R,L,b,E)}function w(A){A.target.removeEventListener("dispose",w);for(const L in c){const b=c[L],E=A.target.uuid;E in b&&(b[E].dispose(),delete b[E])}}}const Vg={[Ao]:Ro,[Co]:Lo,[Po]:Do,[Wi]:Io,[Ro]:Ao,[Lo]:Co,[Do]:Po,[Io]:Wi};function Gg(r,t){function e(){let U=!1;const it=new de;let ct=null;const vt=new de(0,0,0,0);return{setMask:function(tt){ct!==tt&&!U&&(r.colorMask(tt,tt,tt,tt),ct=tt)},setLocked:function(tt){U=tt},setClear:function(tt,J,Mt,Ft,re){re===!0&&(tt*=Ft,J*=Ft,Mt*=Ft),it.set(tt,J,Mt,Ft),vt.equals(it)===!1&&(r.clearColor(tt,J,Mt,Ft),vt.copy(it))},reset:function(){U=!1,ct=null,vt.set(-1,0,0,0)}}}function n(){let U=!1,it=!1,ct=null,vt=null,tt=null;return{setReversed:function(J){if(it!==J){const Mt=t.get("EXT_clip_control");J?Mt.clipControlEXT(Mt.LOWER_LEFT_EXT,Mt.ZERO_TO_ONE_EXT):Mt.clipControlEXT(Mt.LOWER_LEFT_EXT,Mt.NEGATIVE_ONE_TO_ONE_EXT),it=J;const Ft=tt;tt=null,this.setClear(Ft)}},getReversed:function(){return it},setTest:function(J){J?rt(r.DEPTH_TEST):Pt(r.DEPTH_TEST)},setMask:function(J){ct!==J&&!U&&(r.depthMask(J),ct=J)},setFunc:function(J){if(it&&(J=Vg[J]),vt!==J){switch(J){case Ao:r.depthFunc(r.NEVER);break;case Ro:r.depthFunc(r.ALWAYS);break;case Co:r.depthFunc(r.LESS);break;case Wi:r.depthFunc(r.LEQUAL);break;case Po:r.depthFunc(r.EQUAL);break;case Io:r.depthFunc(r.GEQUAL);break;case Lo:r.depthFunc(r.GREATER);break;case Do:r.depthFunc(r.NOTEQUAL);break;default:r.depthFunc(r.LEQUAL)}vt=J}},setLocked:function(J){U=J},setClear:function(J){tt!==J&&(it&&(J=1-J),r.clearDepth(J),tt=J)},reset:function(){U=!1,ct=null,vt=null,tt=null,it=!1}}}function i(){let U=!1,it=null,ct=null,vt=null,tt=null,J=null,Mt=null,Ft=null,re=null;return{setTest:function(Jt){U||(Jt?rt(r.STENCIL_TEST):Pt(r.STENCIL_TEST))},setMask:function(Jt){it!==Jt&&!U&&(r.stencilMask(Jt),it=Jt)},setFunc:function(Jt,An,pn){(ct!==Jt||vt!==An||tt!==pn)&&(r.stencilFunc(Jt,An,pn),ct=Jt,vt=An,tt=pn)},setOp:function(Jt,An,pn){(J!==Jt||Mt!==An||Ft!==pn)&&(r.stencilOp(Jt,An,pn),J=Jt,Mt=An,Ft=pn)},setLocked:function(Jt){U=Jt},setClear:function(Jt){re!==Jt&&(r.clearStencil(Jt),re=Jt)},reset:function(){U=!1,it=null,ct=null,vt=null,tt=null,J=null,Mt=null,Ft=null,re=null}}}const s=new e,o=new n,a=new i,l=new WeakMap,c=new WeakMap;let h={},d={},u=new WeakMap,p=[],g=null,_=!1,m=null,f=null,v=null,S=null,x=null,w=null,A=null,R=new Ht(0,0,0),L=0,b=!1,E=null,P=null,H=null,I=null,F=null;const O=r.getParameter(r.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let N=!1,$=0;const k=r.getParameter(r.VERSION);k.indexOf("WebGL")!==-1?($=parseFloat(/^WebGL (\d)/.exec(k)[1]),N=$>=1):k.indexOf("OpenGL ES")!==-1&&($=parseFloat(/^OpenGL ES (\d)/.exec(k)[1]),N=$>=2);let K=null,ot={};const pt=r.getParameter(r.SCISSOR_BOX),st=r.getParameter(r.VIEWPORT),$t=new de().fromArray(pt),Xt=new de().fromArray(st);function Z(U,it,ct,vt){const tt=new Uint8Array(4),J=r.createTexture();r.bindTexture(U,J),r.texParameteri(U,r.TEXTURE_MIN_FILTER,r.NEAREST),r.texParameteri(U,r.TEXTURE_MAG_FILTER,r.NEAREST);for(let Mt=0;Mt<ct;Mt++)U===r.TEXTURE_3D||U===r.TEXTURE_2D_ARRAY?r.texImage3D(it,0,r.RGBA,1,1,vt,0,r.RGBA,r.UNSIGNED_BYTE,tt):r.texImage2D(it+Mt,0,r.RGBA,1,1,0,r.RGBA,r.UNSIGNED_BYTE,tt);return J}const lt={};lt[r.TEXTURE_2D]=Z(r.TEXTURE_2D,r.TEXTURE_2D,1),lt[r.TEXTURE_CUBE_MAP]=Z(r.TEXTURE_CUBE_MAP,r.TEXTURE_CUBE_MAP_POSITIVE_X,6),lt[r.TEXTURE_2D_ARRAY]=Z(r.TEXTURE_2D_ARRAY,r.TEXTURE_2D_ARRAY,1,1),lt[r.TEXTURE_3D]=Z(r.TEXTURE_3D,r.TEXTURE_3D,1,1),s.setClear(0,0,0,1),o.setClear(1),a.setClear(0),rt(r.DEPTH_TEST),o.setFunc(Wi),Zt(!1),wt(Ha),rt(r.CULL_FACE),se(Kn);function rt(U){h[U]!==!0&&(r.enable(U),h[U]=!0)}function Pt(U){h[U]!==!1&&(r.disable(U),h[U]=!1)}function It(U,it){return d[U]!==it?(r.bindFramebuffer(U,it),d[U]=it,U===r.DRAW_FRAMEBUFFER&&(d[r.FRAMEBUFFER]=it),U===r.FRAMEBUFFER&&(d[r.DRAW_FRAMEBUFFER]=it),!0):!1}function Ut(U,it){let ct=p,vt=!1;if(U){ct=u.get(it),ct===void 0&&(ct=[],u.set(it,ct));const tt=U.textures;if(ct.length!==tt.length||ct[0]!==r.COLOR_ATTACHMENT0){for(let J=0,Mt=tt.length;J<Mt;J++)ct[J]=r.COLOR_ATTACHMENT0+J;ct.length=tt.length,vt=!0}}else ct[0]!==r.BACK&&(ct[0]=r.BACK,vt=!0);vt&&r.drawBuffers(ct)}function pe(U){return g!==U?(r.useProgram(U),g=U,!0):!1}const Wt={[fi]:r.FUNC_ADD,[Yh]:r.FUNC_SUBTRACT,[$h]:r.FUNC_REVERSE_SUBTRACT};Wt[Zh]=r.MIN,Wt[jh]=r.MAX;const D={[Kh]:r.ZERO,[Jh]:r.ONE,[Qh]:r.SRC_COLOR,[bo]:r.SRC_ALPHA,[ru]:r.SRC_ALPHA_SATURATE,[iu]:r.DST_COLOR,[eu]:r.DST_ALPHA,[tu]:r.ONE_MINUS_SRC_COLOR,[wo]:r.ONE_MINUS_SRC_ALPHA,[su]:r.ONE_MINUS_DST_COLOR,[nu]:r.ONE_MINUS_DST_ALPHA,[ou]:r.CONSTANT_COLOR,[au]:r.ONE_MINUS_CONSTANT_COLOR,[cu]:r.CONSTANT_ALPHA,[lu]:r.ONE_MINUS_CONSTANT_ALPHA};function se(U,it,ct,vt,tt,J,Mt,Ft,re,Jt){if(U===Kn){_===!0&&(Pt(r.BLEND),_=!1);return}if(_===!1&&(rt(r.BLEND),_=!0),U!==qh){if(U!==m||Jt!==b){if((f!==fi||x!==fi)&&(r.blendEquation(r.FUNC_ADD),f=fi,x=fi),Jt)switch(U){case ki:r.blendFuncSeparate(r.ONE,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case Wa:r.blendFunc(r.ONE,r.ONE);break;case Xa:r.blendFuncSeparate(r.ZERO,r.ONE_MINUS_SRC_COLOR,r.ZERO,r.ONE);break;case qa:r.blendFuncSeparate(r.DST_COLOR,r.ONE_MINUS_SRC_ALPHA,r.ZERO,r.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}else switch(U){case ki:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case Wa:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE,r.ONE,r.ONE);break;case Xa:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case qa:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}v=null,S=null,w=null,A=null,R.set(0,0,0),L=0,m=U,b=Jt}return}tt=tt||it,J=J||ct,Mt=Mt||vt,(it!==f||tt!==x)&&(r.blendEquationSeparate(Wt[it],Wt[tt]),f=it,x=tt),(ct!==v||vt!==S||J!==w||Mt!==A)&&(r.blendFuncSeparate(D[ct],D[vt],D[J],D[Mt]),v=ct,S=vt,w=J,A=Mt),(Ft.equals(R)===!1||re!==L)&&(r.blendColor(Ft.r,Ft.g,Ft.b,re),R.copy(Ft),L=re),m=U,b=!1}function Rt(U,it){U.side===Bn?Pt(r.CULL_FACE):rt(r.CULL_FACE);let ct=U.side===Be;it&&(ct=!ct),Zt(ct),U.blending===ki&&U.transparent===!1?se(Kn):se(U.blending,U.blendEquation,U.blendSrc,U.blendDst,U.blendEquationAlpha,U.blendSrcAlpha,U.blendDstAlpha,U.blendColor,U.blendAlpha,U.premultipliedAlpha),o.setFunc(U.depthFunc),o.setTest(U.depthTest),o.setMask(U.depthWrite),s.setMask(U.colorWrite);const vt=U.stencilWrite;a.setTest(vt),vt&&(a.setMask(U.stencilWriteMask),a.setFunc(U.stencilFunc,U.stencilRef,U.stencilFuncMask),a.setOp(U.stencilFail,U.stencilZFail,U.stencilZPass)),xt(U.polygonOffset,U.polygonOffsetFactor,U.polygonOffsetUnits),U.alphaToCoverage===!0?rt(r.SAMPLE_ALPHA_TO_COVERAGE):Pt(r.SAMPLE_ALPHA_TO_COVERAGE)}function Zt(U){E!==U&&(U?r.frontFace(r.CW):r.frontFace(r.CCW),E=U)}function wt(U){U!==Hh?(rt(r.CULL_FACE),U!==P&&(U===Ha?r.cullFace(r.BACK):U===Wh?r.cullFace(r.FRONT):r.cullFace(r.FRONT_AND_BACK))):Pt(r.CULL_FACE),P=U}function ce(U){U!==H&&(N&&r.lineWidth(U),H=U)}function xt(U,it,ct){U?(rt(r.POLYGON_OFFSET_FILL),(I!==it||F!==ct)&&(r.polygonOffset(it,ct),I=it,F=ct)):Pt(r.POLYGON_OFFSET_FILL)}function kt(U){U?rt(r.SCISSOR_TEST):Pt(r.SCISSOR_TEST)}function Te(U){U===void 0&&(U=r.TEXTURE0+O-1),K!==U&&(r.activeTexture(U),K=U)}function me(U,it,ct){ct===void 0&&(K===null?ct=r.TEXTURE0+O-1:ct=K);let vt=ot[ct];vt===void 0&&(vt={type:void 0,texture:void 0},ot[ct]=vt),(vt.type!==U||vt.texture!==it)&&(K!==ct&&(r.activeTexture(ct),K=ct),r.bindTexture(U,it||lt[U]),vt.type=U,vt.texture=it)}function C(){const U=ot[K];U!==void 0&&U.type!==void 0&&(r.bindTexture(U.type,null),U.type=void 0,U.texture=void 0)}function y(){try{r.compressedTexImage2D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function G(){try{r.compressedTexImage3D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function j(){try{r.texSubImage2D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Q(){try{r.texSubImage3D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Y(){try{r.compressedTexSubImage2D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function bt(){try{r.compressedTexSubImage3D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function at(){try{r.texStorage2D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function St(){try{r.texStorage3D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Et(){try{r.texImage2D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function nt(){try{r.texImage3D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function ft(U){$t.equals(U)===!1&&(r.scissor(U.x,U.y,U.z,U.w),$t.copy(U))}function Dt(U){Xt.equals(U)===!1&&(r.viewport(U.x,U.y,U.z,U.w),Xt.copy(U))}function Tt(U,it){let ct=c.get(it);ct===void 0&&(ct=new WeakMap,c.set(it,ct));let vt=ct.get(U);vt===void 0&&(vt=r.getUniformBlockIndex(it,U.name),ct.set(U,vt))}function ut(U,it){const vt=c.get(it).get(U);l.get(it)!==vt&&(r.uniformBlockBinding(it,vt,U.__bindingPointIndex),l.set(it,vt))}function Ot(){r.disable(r.BLEND),r.disable(r.CULL_FACE),r.disable(r.DEPTH_TEST),r.disable(r.POLYGON_OFFSET_FILL),r.disable(r.SCISSOR_TEST),r.disable(r.STENCIL_TEST),r.disable(r.SAMPLE_ALPHA_TO_COVERAGE),r.blendEquation(r.FUNC_ADD),r.blendFunc(r.ONE,r.ZERO),r.blendFuncSeparate(r.ONE,r.ZERO,r.ONE,r.ZERO),r.blendColor(0,0,0,0),r.colorMask(!0,!0,!0,!0),r.clearColor(0,0,0,0),r.depthMask(!0),r.depthFunc(r.LESS),o.setReversed(!1),r.clearDepth(1),r.stencilMask(4294967295),r.stencilFunc(r.ALWAYS,0,4294967295),r.stencilOp(r.KEEP,r.KEEP,r.KEEP),r.clearStencil(0),r.cullFace(r.BACK),r.frontFace(r.CCW),r.polygonOffset(0,0),r.activeTexture(r.TEXTURE0),r.bindFramebuffer(r.FRAMEBUFFER,null),r.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),r.bindFramebuffer(r.READ_FRAMEBUFFER,null),r.useProgram(null),r.lineWidth(1),r.scissor(0,0,r.canvas.width,r.canvas.height),r.viewport(0,0,r.canvas.width,r.canvas.height),h={},K=null,ot={},d={},u=new WeakMap,p=[],g=null,_=!1,m=null,f=null,v=null,S=null,x=null,w=null,A=null,R=new Ht(0,0,0),L=0,b=!1,E=null,P=null,H=null,I=null,F=null,$t.set(0,0,r.canvas.width,r.canvas.height),Xt.set(0,0,r.canvas.width,r.canvas.height),s.reset(),o.reset(),a.reset()}return{buffers:{color:s,depth:o,stencil:a},enable:rt,disable:Pt,bindFramebuffer:It,drawBuffers:Ut,useProgram:pe,setBlending:se,setMaterial:Rt,setFlipSided:Zt,setCullFace:wt,setLineWidth:ce,setPolygonOffset:xt,setScissorTest:kt,activeTexture:Te,bindTexture:me,unbindTexture:C,compressedTexImage2D:y,compressedTexImage3D:G,texImage2D:Et,texImage3D:nt,updateUBOMapping:Tt,uniformBlockBinding:ut,texStorage2D:at,texStorage3D:St,texSubImage2D:j,texSubImage3D:Q,compressedTexSubImage2D:Y,compressedTexSubImage3D:bt,scissor:ft,viewport:Dt,reset:Ot}}function Hg(r,t,e,n,i,s,o){const a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Kt,h=new WeakMap;let d;const u=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(C,y){return p?new OffscreenCanvas(C,y):_r("canvas")}function _(C,y,G){let j=1;const Q=me(C);if((Q.width>G||Q.height>G)&&(j=G/Math.max(Q.width,Q.height)),j<1)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap||typeof VideoFrame<"u"&&C instanceof VideoFrame){const Y=Math.floor(j*Q.width),bt=Math.floor(j*Q.height);d===void 0&&(d=g(Y,bt));const at=y?g(Y,bt):d;return at.width=Y,at.height=bt,at.getContext("2d").drawImage(C,0,0,Y,bt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+Q.width+"x"+Q.height+") to ("+Y+"x"+bt+")."),at}else return"data"in C&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+Q.width+"x"+Q.height+")."),C;return C}function m(C){return C.generateMipmaps}function f(C){r.generateMipmap(C)}function v(C){return C.isWebGLCubeRenderTarget?r.TEXTURE_CUBE_MAP:C.isWebGL3DRenderTarget?r.TEXTURE_3D:C.isWebGLArrayRenderTarget||C.isCompressedArrayTexture?r.TEXTURE_2D_ARRAY:r.TEXTURE_2D}function S(C,y,G,j,Q=!1){if(C!==null){if(r[C]!==void 0)return r[C];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let Y=y;if(y===r.RED&&(G===r.FLOAT&&(Y=r.R32F),G===r.HALF_FLOAT&&(Y=r.R16F),G===r.UNSIGNED_BYTE&&(Y=r.R8)),y===r.RED_INTEGER&&(G===r.UNSIGNED_BYTE&&(Y=r.R8UI),G===r.UNSIGNED_SHORT&&(Y=r.R16UI),G===r.UNSIGNED_INT&&(Y=r.R32UI),G===r.BYTE&&(Y=r.R8I),G===r.SHORT&&(Y=r.R16I),G===r.INT&&(Y=r.R32I)),y===r.RG&&(G===r.FLOAT&&(Y=r.RG32F),G===r.HALF_FLOAT&&(Y=r.RG16F),G===r.UNSIGNED_BYTE&&(Y=r.RG8)),y===r.RG_INTEGER&&(G===r.UNSIGNED_BYTE&&(Y=r.RG8UI),G===r.UNSIGNED_SHORT&&(Y=r.RG16UI),G===r.UNSIGNED_INT&&(Y=r.RG32UI),G===r.BYTE&&(Y=r.RG8I),G===r.SHORT&&(Y=r.RG16I),G===r.INT&&(Y=r.RG32I)),y===r.RGB_INTEGER&&(G===r.UNSIGNED_BYTE&&(Y=r.RGB8UI),G===r.UNSIGNED_SHORT&&(Y=r.RGB16UI),G===r.UNSIGNED_INT&&(Y=r.RGB32UI),G===r.BYTE&&(Y=r.RGB8I),G===r.SHORT&&(Y=r.RGB16I),G===r.INT&&(Y=r.RGB32I)),y===r.RGBA_INTEGER&&(G===r.UNSIGNED_BYTE&&(Y=r.RGBA8UI),G===r.UNSIGNED_SHORT&&(Y=r.RGBA16UI),G===r.UNSIGNED_INT&&(Y=r.RGBA32UI),G===r.BYTE&&(Y=r.RGBA8I),G===r.SHORT&&(Y=r.RGBA16I),G===r.INT&&(Y=r.RGBA32I)),y===r.RGB&&G===r.UNSIGNED_INT_5_9_9_9_REV&&(Y=r.RGB9_E5),y===r.RGBA){const bt=Q?mr:Yt.getTransfer(j);G===r.FLOAT&&(Y=r.RGBA32F),G===r.HALF_FLOAT&&(Y=r.RGBA16F),G===r.UNSIGNED_BYTE&&(Y=bt===ne?r.SRGB8_ALPHA8:r.RGBA8),G===r.UNSIGNED_SHORT_4_4_4_4&&(Y=r.RGBA4),G===r.UNSIGNED_SHORT_5_5_5_1&&(Y=r.RGB5_A1)}return(Y===r.R16F||Y===r.R32F||Y===r.RG16F||Y===r.RG32F||Y===r.RGBA16F||Y===r.RGBA32F)&&t.get("EXT_color_buffer_float"),Y}function x(C,y){let G;return C?y===null||y===vi||y===gs?G=r.DEPTH24_STENCIL8:y===kn?G=r.DEPTH32F_STENCIL8:y===ms&&(G=r.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):y===null||y===vi||y===gs?G=r.DEPTH_COMPONENT24:y===kn?G=r.DEPTH_COMPONENT32F:y===ms&&(G=r.DEPTH_COMPONENT16),G}function w(C,y){return m(C)===!0||C.isFramebufferTexture&&C.minFilter!==fn&&C.minFilter!==Sn?Math.log2(Math.max(y.width,y.height))+1:C.mipmaps!==void 0&&C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?y.mipmaps.length:1}function A(C){const y=C.target;y.removeEventListener("dispose",A),L(y),y.isVideoTexture&&h.delete(y)}function R(C){const y=C.target;y.removeEventListener("dispose",R),E(y)}function L(C){const y=n.get(C);if(y.__webglInit===void 0)return;const G=C.source,j=u.get(G);if(j){const Q=j[y.__cacheKey];Q.usedTimes--,Q.usedTimes===0&&b(C),Object.keys(j).length===0&&u.delete(G)}n.remove(C)}function b(C){const y=n.get(C);r.deleteTexture(y.__webglTexture);const G=C.source,j=u.get(G);delete j[y.__cacheKey],o.memory.textures--}function E(C){const y=n.get(C);if(C.depthTexture&&(C.depthTexture.dispose(),n.remove(C.depthTexture)),C.isWebGLCubeRenderTarget)for(let j=0;j<6;j++){if(Array.isArray(y.__webglFramebuffer[j]))for(let Q=0;Q<y.__webglFramebuffer[j].length;Q++)r.deleteFramebuffer(y.__webglFramebuffer[j][Q]);else r.deleteFramebuffer(y.__webglFramebuffer[j]);y.__webglDepthbuffer&&r.deleteRenderbuffer(y.__webglDepthbuffer[j])}else{if(Array.isArray(y.__webglFramebuffer))for(let j=0;j<y.__webglFramebuffer.length;j++)r.deleteFramebuffer(y.__webglFramebuffer[j]);else r.deleteFramebuffer(y.__webglFramebuffer);if(y.__webglDepthbuffer&&r.deleteRenderbuffer(y.__webglDepthbuffer),y.__webglMultisampledFramebuffer&&r.deleteFramebuffer(y.__webglMultisampledFramebuffer),y.__webglColorRenderbuffer)for(let j=0;j<y.__webglColorRenderbuffer.length;j++)y.__webglColorRenderbuffer[j]&&r.deleteRenderbuffer(y.__webglColorRenderbuffer[j]);y.__webglDepthRenderbuffer&&r.deleteRenderbuffer(y.__webglDepthRenderbuffer)}const G=C.textures;for(let j=0,Q=G.length;j<Q;j++){const Y=n.get(G[j]);Y.__webglTexture&&(r.deleteTexture(Y.__webglTexture),o.memory.textures--),n.remove(G[j])}n.remove(C)}let P=0;function H(){P=0}function I(){const C=P;return C>=i.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+C+" texture units while this GPU supports only "+i.maxTextures),P+=1,C}function F(C){const y=[];return y.push(C.wrapS),y.push(C.wrapT),y.push(C.wrapR||0),y.push(C.magFilter),y.push(C.minFilter),y.push(C.anisotropy),y.push(C.internalFormat),y.push(C.format),y.push(C.type),y.push(C.generateMipmaps),y.push(C.premultiplyAlpha),y.push(C.flipY),y.push(C.unpackAlignment),y.push(C.colorSpace),y.join()}function O(C,y){const G=n.get(C);if(C.isVideoTexture&&kt(C),C.isRenderTargetTexture===!1&&C.isExternalTexture!==!0&&C.version>0&&G.__version!==C.version){const j=C.image;if(j===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(j.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{lt(G,C,y);return}}else C.isExternalTexture&&(G.__webglTexture=C.sourceTexture?C.sourceTexture:null);e.bindTexture(r.TEXTURE_2D,G.__webglTexture,r.TEXTURE0+y)}function N(C,y){const G=n.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&G.__version!==C.version){lt(G,C,y);return}e.bindTexture(r.TEXTURE_2D_ARRAY,G.__webglTexture,r.TEXTURE0+y)}function $(C,y){const G=n.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&G.__version!==C.version){lt(G,C,y);return}e.bindTexture(r.TEXTURE_3D,G.__webglTexture,r.TEXTURE0+y)}function k(C,y){const G=n.get(C);if(C.version>0&&G.__version!==C.version){rt(G,C,y);return}e.bindTexture(r.TEXTURE_CUBE_MAP,G.__webglTexture,r.TEXTURE0+y)}const K={[Fo]:r.REPEAT,[gi]:r.CLAMP_TO_EDGE,[Oo]:r.MIRRORED_REPEAT},ot={[fn]:r.NEAREST,[xu]:r.NEAREST_MIPMAP_NEAREST,[Cs]:r.NEAREST_MIPMAP_LINEAR,[Sn]:r.LINEAR,[Ir]:r.LINEAR_MIPMAP_NEAREST,[_i]:r.LINEAR_MIPMAP_LINEAR},pt={[Eu]:r.NEVER,[Cu]:r.ALWAYS,[Tu]:r.LESS,[Wl]:r.LEQUAL,[bu]:r.EQUAL,[Ru]:r.GEQUAL,[wu]:r.GREATER,[Au]:r.NOTEQUAL};function st(C,y){if(y.type===kn&&t.has("OES_texture_float_linear")===!1&&(y.magFilter===Sn||y.magFilter===Ir||y.magFilter===Cs||y.magFilter===_i||y.minFilter===Sn||y.minFilter===Ir||y.minFilter===Cs||y.minFilter===_i)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),r.texParameteri(C,r.TEXTURE_WRAP_S,K[y.wrapS]),r.texParameteri(C,r.TEXTURE_WRAP_T,K[y.wrapT]),(C===r.TEXTURE_3D||C===r.TEXTURE_2D_ARRAY)&&r.texParameteri(C,r.TEXTURE_WRAP_R,K[y.wrapR]),r.texParameteri(C,r.TEXTURE_MAG_FILTER,ot[y.magFilter]),r.texParameteri(C,r.TEXTURE_MIN_FILTER,ot[y.minFilter]),y.compareFunction&&(r.texParameteri(C,r.TEXTURE_COMPARE_MODE,r.COMPARE_REF_TO_TEXTURE),r.texParameteri(C,r.TEXTURE_COMPARE_FUNC,pt[y.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(y.magFilter===fn||y.minFilter!==Cs&&y.minFilter!==_i||y.type===kn&&t.has("OES_texture_float_linear")===!1)return;if(y.anisotropy>1||n.get(y).__currentAnisotropy){const G=t.get("EXT_texture_filter_anisotropic");r.texParameterf(C,G.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(y.anisotropy,i.getMaxAnisotropy())),n.get(y).__currentAnisotropy=y.anisotropy}}}function $t(C,y){let G=!1;C.__webglInit===void 0&&(C.__webglInit=!0,y.addEventListener("dispose",A));const j=y.source;let Q=u.get(j);Q===void 0&&(Q={},u.set(j,Q));const Y=F(y);if(Y!==C.__cacheKey){Q[Y]===void 0&&(Q[Y]={texture:r.createTexture(),usedTimes:0},o.memory.textures++,G=!0),Q[Y].usedTimes++;const bt=Q[C.__cacheKey];bt!==void 0&&(Q[C.__cacheKey].usedTimes--,bt.usedTimes===0&&b(y)),C.__cacheKey=Y,C.__webglTexture=Q[Y].texture}return G}function Xt(C,y,G){return Math.floor(Math.floor(C/G)/y)}function Z(C,y,G,j){const Y=C.updateRanges;if(Y.length===0)e.texSubImage2D(r.TEXTURE_2D,0,0,0,y.width,y.height,G,j,y.data);else{Y.sort((nt,ft)=>nt.start-ft.start);let bt=0;for(let nt=1;nt<Y.length;nt++){const ft=Y[bt],Dt=Y[nt],Tt=ft.start+ft.count,ut=Xt(Dt.start,y.width,4),Ot=Xt(ft.start,y.width,4);Dt.start<=Tt+1&&ut===Ot&&Xt(Dt.start+Dt.count-1,y.width,4)===ut?ft.count=Math.max(ft.count,Dt.start+Dt.count-ft.start):(++bt,Y[bt]=Dt)}Y.length=bt+1;const at=r.getParameter(r.UNPACK_ROW_LENGTH),St=r.getParameter(r.UNPACK_SKIP_PIXELS),Et=r.getParameter(r.UNPACK_SKIP_ROWS);r.pixelStorei(r.UNPACK_ROW_LENGTH,y.width);for(let nt=0,ft=Y.length;nt<ft;nt++){const Dt=Y[nt],Tt=Math.floor(Dt.start/4),ut=Math.ceil(Dt.count/4),Ot=Tt%y.width,U=Math.floor(Tt/y.width),it=ut,ct=1;r.pixelStorei(r.UNPACK_SKIP_PIXELS,Ot),r.pixelStorei(r.UNPACK_SKIP_ROWS,U),e.texSubImage2D(r.TEXTURE_2D,0,Ot,U,it,ct,G,j,y.data)}C.clearUpdateRanges(),r.pixelStorei(r.UNPACK_ROW_LENGTH,at),r.pixelStorei(r.UNPACK_SKIP_PIXELS,St),r.pixelStorei(r.UNPACK_SKIP_ROWS,Et)}}function lt(C,y,G){let j=r.TEXTURE_2D;(y.isDataArrayTexture||y.isCompressedArrayTexture)&&(j=r.TEXTURE_2D_ARRAY),y.isData3DTexture&&(j=r.TEXTURE_3D);const Q=$t(C,y),Y=y.source;e.bindTexture(j,C.__webglTexture,r.TEXTURE0+G);const bt=n.get(Y);if(Y.version!==bt.__version||Q===!0){e.activeTexture(r.TEXTURE0+G);const at=Yt.getPrimaries(Yt.workingColorSpace),St=y.colorSpace===jn?null:Yt.getPrimaries(y.colorSpace),Et=y.colorSpace===jn||at===St?r.NONE:r.BROWSER_DEFAULT_WEBGL;r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,y.flipY),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),r.pixelStorei(r.UNPACK_ALIGNMENT,y.unpackAlignment),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,Et);let nt=_(y.image,!1,i.maxTextureSize);nt=Te(y,nt);const ft=s.convert(y.format,y.colorSpace),Dt=s.convert(y.type);let Tt=S(y.internalFormat,ft,Dt,y.colorSpace,y.isVideoTexture);st(j,y);let ut;const Ot=y.mipmaps,U=y.isVideoTexture!==!0,it=bt.__version===void 0||Q===!0,ct=Y.dataReady,vt=w(y,nt);if(y.isDepthTexture)Tt=x(y.format===vs,y.type),it&&(U?e.texStorage2D(r.TEXTURE_2D,1,Tt,nt.width,nt.height):e.texImage2D(r.TEXTURE_2D,0,Tt,nt.width,nt.height,0,ft,Dt,null));else if(y.isDataTexture)if(Ot.length>0){U&&it&&e.texStorage2D(r.TEXTURE_2D,vt,Tt,Ot[0].width,Ot[0].height);for(let tt=0,J=Ot.length;tt<J;tt++)ut=Ot[tt],U?ct&&e.texSubImage2D(r.TEXTURE_2D,tt,0,0,ut.width,ut.height,ft,Dt,ut.data):e.texImage2D(r.TEXTURE_2D,tt,Tt,ut.width,ut.height,0,ft,Dt,ut.data);y.generateMipmaps=!1}else U?(it&&e.texStorage2D(r.TEXTURE_2D,vt,Tt,nt.width,nt.height),ct&&Z(y,nt,ft,Dt)):e.texImage2D(r.TEXTURE_2D,0,Tt,nt.width,nt.height,0,ft,Dt,nt.data);else if(y.isCompressedTexture)if(y.isCompressedArrayTexture){U&&it&&e.texStorage3D(r.TEXTURE_2D_ARRAY,vt,Tt,Ot[0].width,Ot[0].height,nt.depth);for(let tt=0,J=Ot.length;tt<J;tt++)if(ut=Ot[tt],y.format!==un)if(ft!==null)if(U){if(ct)if(y.layerUpdates.size>0){const Mt=yc(ut.width,ut.height,y.format,y.type);for(const Ft of y.layerUpdates){const re=ut.data.subarray(Ft*Mt/ut.data.BYTES_PER_ELEMENT,(Ft+1)*Mt/ut.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,tt,0,0,Ft,ut.width,ut.height,1,ft,re)}y.clearLayerUpdates()}else e.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,tt,0,0,0,ut.width,ut.height,nt.depth,ft,ut.data)}else e.compressedTexImage3D(r.TEXTURE_2D_ARRAY,tt,Tt,ut.width,ut.height,nt.depth,0,ut.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else U?ct&&e.texSubImage3D(r.TEXTURE_2D_ARRAY,tt,0,0,0,ut.width,ut.height,nt.depth,ft,Dt,ut.data):e.texImage3D(r.TEXTURE_2D_ARRAY,tt,Tt,ut.width,ut.height,nt.depth,0,ft,Dt,ut.data)}else{U&&it&&e.texStorage2D(r.TEXTURE_2D,vt,Tt,Ot[0].width,Ot[0].height);for(let tt=0,J=Ot.length;tt<J;tt++)ut=Ot[tt],y.format!==un?ft!==null?U?ct&&e.compressedTexSubImage2D(r.TEXTURE_2D,tt,0,0,ut.width,ut.height,ft,ut.data):e.compressedTexImage2D(r.TEXTURE_2D,tt,Tt,ut.width,ut.height,0,ut.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):U?ct&&e.texSubImage2D(r.TEXTURE_2D,tt,0,0,ut.width,ut.height,ft,Dt,ut.data):e.texImage2D(r.TEXTURE_2D,tt,Tt,ut.width,ut.height,0,ft,Dt,ut.data)}else if(y.isDataArrayTexture)if(U){if(it&&e.texStorage3D(r.TEXTURE_2D_ARRAY,vt,Tt,nt.width,nt.height,nt.depth),ct)if(y.layerUpdates.size>0){const tt=yc(nt.width,nt.height,y.format,y.type);for(const J of y.layerUpdates){const Mt=nt.data.subarray(J*tt/nt.data.BYTES_PER_ELEMENT,(J+1)*tt/nt.data.BYTES_PER_ELEMENT);e.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,J,nt.width,nt.height,1,ft,Dt,Mt)}y.clearLayerUpdates()}else e.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,0,nt.width,nt.height,nt.depth,ft,Dt,nt.data)}else e.texImage3D(r.TEXTURE_2D_ARRAY,0,Tt,nt.width,nt.height,nt.depth,0,ft,Dt,nt.data);else if(y.isData3DTexture)U?(it&&e.texStorage3D(r.TEXTURE_3D,vt,Tt,nt.width,nt.height,nt.depth),ct&&e.texSubImage3D(r.TEXTURE_3D,0,0,0,0,nt.width,nt.height,nt.depth,ft,Dt,nt.data)):e.texImage3D(r.TEXTURE_3D,0,Tt,nt.width,nt.height,nt.depth,0,ft,Dt,nt.data);else if(y.isFramebufferTexture){if(it)if(U)e.texStorage2D(r.TEXTURE_2D,vt,Tt,nt.width,nt.height);else{let tt=nt.width,J=nt.height;for(let Mt=0;Mt<vt;Mt++)e.texImage2D(r.TEXTURE_2D,Mt,Tt,tt,J,0,ft,Dt,null),tt>>=1,J>>=1}}else if(Ot.length>0){if(U&&it){const tt=me(Ot[0]);e.texStorage2D(r.TEXTURE_2D,vt,Tt,tt.width,tt.height)}for(let tt=0,J=Ot.length;tt<J;tt++)ut=Ot[tt],U?ct&&e.texSubImage2D(r.TEXTURE_2D,tt,0,0,ft,Dt,ut):e.texImage2D(r.TEXTURE_2D,tt,Tt,ft,Dt,ut);y.generateMipmaps=!1}else if(U){if(it){const tt=me(nt);e.texStorage2D(r.TEXTURE_2D,vt,Tt,tt.width,tt.height)}ct&&e.texSubImage2D(r.TEXTURE_2D,0,0,0,ft,Dt,nt)}else e.texImage2D(r.TEXTURE_2D,0,Tt,ft,Dt,nt);m(y)&&f(j),bt.__version=Y.version,y.onUpdate&&y.onUpdate(y)}C.__version=y.version}function rt(C,y,G){if(y.image.length!==6)return;const j=$t(C,y),Q=y.source;e.bindTexture(r.TEXTURE_CUBE_MAP,C.__webglTexture,r.TEXTURE0+G);const Y=n.get(Q);if(Q.version!==Y.__version||j===!0){e.activeTexture(r.TEXTURE0+G);const bt=Yt.getPrimaries(Yt.workingColorSpace),at=y.colorSpace===jn?null:Yt.getPrimaries(y.colorSpace),St=y.colorSpace===jn||bt===at?r.NONE:r.BROWSER_DEFAULT_WEBGL;r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,y.flipY),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),r.pixelStorei(r.UNPACK_ALIGNMENT,y.unpackAlignment),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,St);const Et=y.isCompressedTexture||y.image[0].isCompressedTexture,nt=y.image[0]&&y.image[0].isDataTexture,ft=[];for(let J=0;J<6;J++)!Et&&!nt?ft[J]=_(y.image[J],!0,i.maxCubemapSize):ft[J]=nt?y.image[J].image:y.image[J],ft[J]=Te(y,ft[J]);const Dt=ft[0],Tt=s.convert(y.format,y.colorSpace),ut=s.convert(y.type),Ot=S(y.internalFormat,Tt,ut,y.colorSpace),U=y.isVideoTexture!==!0,it=Y.__version===void 0||j===!0,ct=Q.dataReady;let vt=w(y,Dt);st(r.TEXTURE_CUBE_MAP,y);let tt;if(Et){U&&it&&e.texStorage2D(r.TEXTURE_CUBE_MAP,vt,Ot,Dt.width,Dt.height);for(let J=0;J<6;J++){tt=ft[J].mipmaps;for(let Mt=0;Mt<tt.length;Mt++){const Ft=tt[Mt];y.format!==un?Tt!==null?U?ct&&e.compressedTexSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+J,Mt,0,0,Ft.width,Ft.height,Tt,Ft.data):e.compressedTexImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+J,Mt,Ot,Ft.width,Ft.height,0,Ft.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):U?ct&&e.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+J,Mt,0,0,Ft.width,Ft.height,Tt,ut,Ft.data):e.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+J,Mt,Ot,Ft.width,Ft.height,0,Tt,ut,Ft.data)}}}else{if(tt=y.mipmaps,U&&it){tt.length>0&&vt++;const J=me(ft[0]);e.texStorage2D(r.TEXTURE_CUBE_MAP,vt,Ot,J.width,J.height)}for(let J=0;J<6;J++)if(nt){U?ct&&e.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,0,0,ft[J].width,ft[J].height,Tt,ut,ft[J].data):e.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,Ot,ft[J].width,ft[J].height,0,Tt,ut,ft[J].data);for(let Mt=0;Mt<tt.length;Mt++){const re=tt[Mt].image[J].image;U?ct&&e.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+J,Mt+1,0,0,re.width,re.height,Tt,ut,re.data):e.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+J,Mt+1,Ot,re.width,re.height,0,Tt,ut,re.data)}}else{U?ct&&e.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,0,0,Tt,ut,ft[J]):e.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,Ot,Tt,ut,ft[J]);for(let Mt=0;Mt<tt.length;Mt++){const Ft=tt[Mt];U?ct&&e.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+J,Mt+1,0,0,Tt,ut,Ft.image[J]):e.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+J,Mt+1,Ot,Tt,ut,Ft.image[J])}}}m(y)&&f(r.TEXTURE_CUBE_MAP),Y.__version=Q.version,y.onUpdate&&y.onUpdate(y)}C.__version=y.version}function Pt(C,y,G,j,Q,Y){const bt=s.convert(G.format,G.colorSpace),at=s.convert(G.type),St=S(G.internalFormat,bt,at,G.colorSpace),Et=n.get(y),nt=n.get(G);if(nt.__renderTarget=y,!Et.__hasExternalTextures){const ft=Math.max(1,y.width>>Y),Dt=Math.max(1,y.height>>Y);Q===r.TEXTURE_3D||Q===r.TEXTURE_2D_ARRAY?e.texImage3D(Q,Y,St,ft,Dt,y.depth,0,bt,at,null):e.texImage2D(Q,Y,St,ft,Dt,0,bt,at,null)}e.bindFramebuffer(r.FRAMEBUFFER,C),xt(y)?a.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,j,Q,nt.__webglTexture,0,ce(y)):(Q===r.TEXTURE_2D||Q>=r.TEXTURE_CUBE_MAP_POSITIVE_X&&Q<=r.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&r.framebufferTexture2D(r.FRAMEBUFFER,j,Q,nt.__webglTexture,Y),e.bindFramebuffer(r.FRAMEBUFFER,null)}function It(C,y,G){if(r.bindRenderbuffer(r.RENDERBUFFER,C),y.depthBuffer){const j=y.depthTexture,Q=j&&j.isDepthTexture?j.type:null,Y=x(y.stencilBuffer,Q),bt=y.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,at=ce(y);xt(y)?a.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,at,Y,y.width,y.height):G?r.renderbufferStorageMultisample(r.RENDERBUFFER,at,Y,y.width,y.height):r.renderbufferStorage(r.RENDERBUFFER,Y,y.width,y.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,bt,r.RENDERBUFFER,C)}else{const j=y.textures;for(let Q=0;Q<j.length;Q++){const Y=j[Q],bt=s.convert(Y.format,Y.colorSpace),at=s.convert(Y.type),St=S(Y.internalFormat,bt,at,Y.colorSpace),Et=ce(y);G&&xt(y)===!1?r.renderbufferStorageMultisample(r.RENDERBUFFER,Et,St,y.width,y.height):xt(y)?a.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,Et,St,y.width,y.height):r.renderbufferStorage(r.RENDERBUFFER,St,y.width,y.height)}}r.bindRenderbuffer(r.RENDERBUFFER,null)}function Ut(C,y){if(y&&y.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(r.FRAMEBUFFER,C),!(y.depthTexture&&y.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const j=n.get(y.depthTexture);j.__renderTarget=y,(!j.__webglTexture||y.depthTexture.image.width!==y.width||y.depthTexture.image.height!==y.height)&&(y.depthTexture.image.width=y.width,y.depthTexture.image.height=y.height,y.depthTexture.needsUpdate=!0),O(y.depthTexture,0);const Q=j.__webglTexture,Y=ce(y);if(y.depthTexture.format===_s)xt(y)?a.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.TEXTURE_2D,Q,0,Y):r.framebufferTexture2D(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.TEXTURE_2D,Q,0);else if(y.depthTexture.format===vs)xt(y)?a.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,r.DEPTH_STENCIL_ATTACHMENT,r.TEXTURE_2D,Q,0,Y):r.framebufferTexture2D(r.FRAMEBUFFER,r.DEPTH_STENCIL_ATTACHMENT,r.TEXTURE_2D,Q,0);else throw new Error("Unknown depthTexture format")}function pe(C){const y=n.get(C),G=C.isWebGLCubeRenderTarget===!0;if(y.__boundDepthTexture!==C.depthTexture){const j=C.depthTexture;if(y.__depthDisposeCallback&&y.__depthDisposeCallback(),j){const Q=()=>{delete y.__boundDepthTexture,delete y.__depthDisposeCallback,j.removeEventListener("dispose",Q)};j.addEventListener("dispose",Q),y.__depthDisposeCallback=Q}y.__boundDepthTexture=j}if(C.depthTexture&&!y.__autoAllocateDepthBuffer){if(G)throw new Error("target.depthTexture not supported in Cube render targets");const j=C.texture.mipmaps;j&&j.length>0?Ut(y.__webglFramebuffer[0],C):Ut(y.__webglFramebuffer,C)}else if(G){y.__webglDepthbuffer=[];for(let j=0;j<6;j++)if(e.bindFramebuffer(r.FRAMEBUFFER,y.__webglFramebuffer[j]),y.__webglDepthbuffer[j]===void 0)y.__webglDepthbuffer[j]=r.createRenderbuffer(),It(y.__webglDepthbuffer[j],C,!1);else{const Q=C.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,Y=y.__webglDepthbuffer[j];r.bindRenderbuffer(r.RENDERBUFFER,Y),r.framebufferRenderbuffer(r.FRAMEBUFFER,Q,r.RENDERBUFFER,Y)}}else{const j=C.texture.mipmaps;if(j&&j.length>0?e.bindFramebuffer(r.FRAMEBUFFER,y.__webglFramebuffer[0]):e.bindFramebuffer(r.FRAMEBUFFER,y.__webglFramebuffer),y.__webglDepthbuffer===void 0)y.__webglDepthbuffer=r.createRenderbuffer(),It(y.__webglDepthbuffer,C,!1);else{const Q=C.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,Y=y.__webglDepthbuffer;r.bindRenderbuffer(r.RENDERBUFFER,Y),r.framebufferRenderbuffer(r.FRAMEBUFFER,Q,r.RENDERBUFFER,Y)}}e.bindFramebuffer(r.FRAMEBUFFER,null)}function Wt(C,y,G){const j=n.get(C);y!==void 0&&Pt(j.__webglFramebuffer,C,C.texture,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,0),G!==void 0&&pe(C)}function D(C){const y=C.texture,G=n.get(C),j=n.get(y);C.addEventListener("dispose",R);const Q=C.textures,Y=C.isWebGLCubeRenderTarget===!0,bt=Q.length>1;if(bt||(j.__webglTexture===void 0&&(j.__webglTexture=r.createTexture()),j.__version=y.version,o.memory.textures++),Y){G.__webglFramebuffer=[];for(let at=0;at<6;at++)if(y.mipmaps&&y.mipmaps.length>0){G.__webglFramebuffer[at]=[];for(let St=0;St<y.mipmaps.length;St++)G.__webglFramebuffer[at][St]=r.createFramebuffer()}else G.__webglFramebuffer[at]=r.createFramebuffer()}else{if(y.mipmaps&&y.mipmaps.length>0){G.__webglFramebuffer=[];for(let at=0;at<y.mipmaps.length;at++)G.__webglFramebuffer[at]=r.createFramebuffer()}else G.__webglFramebuffer=r.createFramebuffer();if(bt)for(let at=0,St=Q.length;at<St;at++){const Et=n.get(Q[at]);Et.__webglTexture===void 0&&(Et.__webglTexture=r.createTexture(),o.memory.textures++)}if(C.samples>0&&xt(C)===!1){G.__webglMultisampledFramebuffer=r.createFramebuffer(),G.__webglColorRenderbuffer=[],e.bindFramebuffer(r.FRAMEBUFFER,G.__webglMultisampledFramebuffer);for(let at=0;at<Q.length;at++){const St=Q[at];G.__webglColorRenderbuffer[at]=r.createRenderbuffer(),r.bindRenderbuffer(r.RENDERBUFFER,G.__webglColorRenderbuffer[at]);const Et=s.convert(St.format,St.colorSpace),nt=s.convert(St.type),ft=S(St.internalFormat,Et,nt,St.colorSpace,C.isXRRenderTarget===!0),Dt=ce(C);r.renderbufferStorageMultisample(r.RENDERBUFFER,Dt,ft,C.width,C.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+at,r.RENDERBUFFER,G.__webglColorRenderbuffer[at])}r.bindRenderbuffer(r.RENDERBUFFER,null),C.depthBuffer&&(G.__webglDepthRenderbuffer=r.createRenderbuffer(),It(G.__webglDepthRenderbuffer,C,!0)),e.bindFramebuffer(r.FRAMEBUFFER,null)}}if(Y){e.bindTexture(r.TEXTURE_CUBE_MAP,j.__webglTexture),st(r.TEXTURE_CUBE_MAP,y);for(let at=0;at<6;at++)if(y.mipmaps&&y.mipmaps.length>0)for(let St=0;St<y.mipmaps.length;St++)Pt(G.__webglFramebuffer[at][St],C,y,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+at,St);else Pt(G.__webglFramebuffer[at],C,y,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+at,0);m(y)&&f(r.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(bt){for(let at=0,St=Q.length;at<St;at++){const Et=Q[at],nt=n.get(Et);let ft=r.TEXTURE_2D;(C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(ft=C.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY),e.bindTexture(ft,nt.__webglTexture),st(ft,Et),Pt(G.__webglFramebuffer,C,Et,r.COLOR_ATTACHMENT0+at,ft,0),m(Et)&&f(ft)}e.unbindTexture()}else{let at=r.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(at=C.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY),e.bindTexture(at,j.__webglTexture),st(at,y),y.mipmaps&&y.mipmaps.length>0)for(let St=0;St<y.mipmaps.length;St++)Pt(G.__webglFramebuffer[St],C,y,r.COLOR_ATTACHMENT0,at,St);else Pt(G.__webglFramebuffer,C,y,r.COLOR_ATTACHMENT0,at,0);m(y)&&f(at),e.unbindTexture()}C.depthBuffer&&pe(C)}function se(C){const y=C.textures;for(let G=0,j=y.length;G<j;G++){const Q=y[G];if(m(Q)){const Y=v(C),bt=n.get(Q).__webglTexture;e.bindTexture(Y,bt),f(Y),e.unbindTexture()}}}const Rt=[],Zt=[];function wt(C){if(C.samples>0){if(xt(C)===!1){const y=C.textures,G=C.width,j=C.height;let Q=r.COLOR_BUFFER_BIT;const Y=C.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,bt=n.get(C),at=y.length>1;if(at)for(let Et=0;Et<y.length;Et++)e.bindFramebuffer(r.FRAMEBUFFER,bt.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+Et,r.RENDERBUFFER,null),e.bindFramebuffer(r.FRAMEBUFFER,bt.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+Et,r.TEXTURE_2D,null,0);e.bindFramebuffer(r.READ_FRAMEBUFFER,bt.__webglMultisampledFramebuffer);const St=C.texture.mipmaps;St&&St.length>0?e.bindFramebuffer(r.DRAW_FRAMEBUFFER,bt.__webglFramebuffer[0]):e.bindFramebuffer(r.DRAW_FRAMEBUFFER,bt.__webglFramebuffer);for(let Et=0;Et<y.length;Et++){if(C.resolveDepthBuffer&&(C.depthBuffer&&(Q|=r.DEPTH_BUFFER_BIT),C.stencilBuffer&&C.resolveStencilBuffer&&(Q|=r.STENCIL_BUFFER_BIT)),at){r.framebufferRenderbuffer(r.READ_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.RENDERBUFFER,bt.__webglColorRenderbuffer[Et]);const nt=n.get(y[Et]).__webglTexture;r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,nt,0)}r.blitFramebuffer(0,0,G,j,0,0,G,j,Q,r.NEAREST),l===!0&&(Rt.length=0,Zt.length=0,Rt.push(r.COLOR_ATTACHMENT0+Et),C.depthBuffer&&C.resolveDepthBuffer===!1&&(Rt.push(Y),Zt.push(Y),r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,Zt)),r.invalidateFramebuffer(r.READ_FRAMEBUFFER,Rt))}if(e.bindFramebuffer(r.READ_FRAMEBUFFER,null),e.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),at)for(let Et=0;Et<y.length;Et++){e.bindFramebuffer(r.FRAMEBUFFER,bt.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+Et,r.RENDERBUFFER,bt.__webglColorRenderbuffer[Et]);const nt=n.get(y[Et]).__webglTexture;e.bindFramebuffer(r.FRAMEBUFFER,bt.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+Et,r.TEXTURE_2D,nt,0)}e.bindFramebuffer(r.DRAW_FRAMEBUFFER,bt.__webglMultisampledFramebuffer)}else if(C.depthBuffer&&C.resolveDepthBuffer===!1&&l){const y=C.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,[y])}}}function ce(C){return Math.min(i.maxSamples,C.samples)}function xt(C){const y=n.get(C);return C.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&y.__useRenderToTexture!==!1}function kt(C){const y=o.render.frame;h.get(C)!==y&&(h.set(C,y),C.update())}function Te(C,y){const G=C.colorSpace,j=C.format,Q=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||G!==Yi&&G!==jn&&(Yt.getTransfer(G)===ne?(j!==un||Q!==bn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",G)),y}function me(C){return typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement?(c.width=C.naturalWidth||C.width,c.height=C.naturalHeight||C.height):typeof VideoFrame<"u"&&C instanceof VideoFrame?(c.width=C.displayWidth,c.height=C.displayHeight):(c.width=C.width,c.height=C.height),c}this.allocateTextureUnit=I,this.resetTextureUnits=H,this.setTexture2D=O,this.setTexture2DArray=N,this.setTexture3D=$,this.setTextureCube=k,this.rebindTextures=Wt,this.setupRenderTarget=D,this.updateRenderTargetMipmap=se,this.updateMultisampleRenderTarget=wt,this.setupDepthRenderbuffer=pe,this.setupFrameBufferTexture=Pt,this.useMultisampledRTT=xt}function Wg(r,t){function e(n,i=jn){let s;const o=Yt.getTransfer(i);if(n===bn)return r.UNSIGNED_BYTE;if(n===_a)return r.UNSIGNED_SHORT_4_4_4_4;if(n===va)return r.UNSIGNED_SHORT_5_5_5_1;if(n===Ol)return r.UNSIGNED_INT_5_9_9_9_REV;if(n===Ul)return r.BYTE;if(n===Fl)return r.SHORT;if(n===ms)return r.UNSIGNED_SHORT;if(n===ga)return r.INT;if(n===vi)return r.UNSIGNED_INT;if(n===kn)return r.FLOAT;if(n===Ms)return r.HALF_FLOAT;if(n===zl)return r.ALPHA;if(n===Bl)return r.RGB;if(n===un)return r.RGBA;if(n===_s)return r.DEPTH_COMPONENT;if(n===vs)return r.DEPTH_STENCIL;if(n===kl)return r.RED;if(n===xa)return r.RED_INTEGER;if(n===Vl)return r.RG;if(n===ya)return r.RG_INTEGER;if(n===Ma)return r.RGBA_INTEGER;if(n===ar||n===cr||n===lr||n===hr)if(o===ne)if(s=t.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(n===ar)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===cr)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===lr)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===hr)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=t.get("WEBGL_compressed_texture_s3tc"),s!==null){if(n===ar)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===cr)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===lr)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===hr)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===zo||n===Bo||n===ko||n===Vo)if(s=t.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(n===zo)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Bo)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===ko)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Vo)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Go||n===Ho||n===Wo)if(s=t.get("WEBGL_compressed_texture_etc"),s!==null){if(n===Go||n===Ho)return o===ne?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(n===Wo)return o===ne?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Xo||n===qo||n===Yo||n===$o||n===Zo||n===jo||n===Ko||n===Jo||n===Qo||n===ta||n===ea||n===na||n===ia||n===sa)if(s=t.get("WEBGL_compressed_texture_astc"),s!==null){if(n===Xo)return o===ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===qo)return o===ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Yo)return o===ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===$o)return o===ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Zo)return o===ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===jo)return o===ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Ko)return o===ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Jo)return o===ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Qo)return o===ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===ta)return o===ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===ea)return o===ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===na)return o===ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===ia)return o===ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===sa)return o===ne?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===ur||n===ra||n===oa)if(s=t.get("EXT_texture_compression_bptc"),s!==null){if(n===ur)return o===ne?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===ra)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===oa)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Gl||n===aa||n===ca||n===la)if(s=t.get("EXT_texture_compression_rgtc"),s!==null){if(n===ur)return s.COMPRESSED_RED_RGTC1_EXT;if(n===aa)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===ca)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===la)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===gs?r.UNSIGNED_INT_24_8:r[n]!==void 0?r[n]:null}return{convert:e}}class hh extends We{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}}const Xg=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,qg=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class Yg{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){const n=new hh(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new ti({vertexShader:Xg,fragmentShader:qg,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new ze(new wr(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class $g extends ji{constructor(t,e){super();const n=this;let i=null,s=1,o=null,a="local-floor",l=1,c=null,h=null,d=null,u=null,p=null,g=null;const _=new Yg,m={},f=e.getContextAttributes();let v=null,S=null;const x=[],w=[],A=new Kt;let R=null;const L=new sn;L.viewport=new de;const b=new sn;b.viewport=new de;const E=[L,b],P=new pd;let H=null,I=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Z){let lt=x[Z];return lt===void 0&&(lt=new Qr,x[Z]=lt),lt.getTargetRaySpace()},this.getControllerGrip=function(Z){let lt=x[Z];return lt===void 0&&(lt=new Qr,x[Z]=lt),lt.getGripSpace()},this.getHand=function(Z){let lt=x[Z];return lt===void 0&&(lt=new Qr,x[Z]=lt),lt.getHandSpace()};function F(Z){const lt=w.indexOf(Z.inputSource);if(lt===-1)return;const rt=x[lt];rt!==void 0&&(rt.update(Z.inputSource,Z.frame,c||o),rt.dispatchEvent({type:Z.type,data:Z.inputSource}))}function O(){i.removeEventListener("select",F),i.removeEventListener("selectstart",F),i.removeEventListener("selectend",F),i.removeEventListener("squeeze",F),i.removeEventListener("squeezestart",F),i.removeEventListener("squeezeend",F),i.removeEventListener("end",O),i.removeEventListener("inputsourceschange",N);for(let Z=0;Z<x.length;Z++){const lt=w[Z];lt!==null&&(w[Z]=null,x[Z].disconnect(lt))}H=null,I=null,_.reset();for(const Z in m)delete m[Z];t.setRenderTarget(v),p=null,u=null,d=null,i=null,S=null,Xt.stop(),n.isPresenting=!1,t.setPixelRatio(R),t.setSize(A.width,A.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Z){s=Z,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Z){a=Z,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(Z){c=Z},this.getBaseLayer=function(){return u!==null?u:p},this.getBinding=function(){return d},this.getFrame=function(){return g},this.getSession=function(){return i},this.setSession=async function(Z){if(i=Z,i!==null){if(v=t.getRenderTarget(),i.addEventListener("select",F),i.addEventListener("selectstart",F),i.addEventListener("selectend",F),i.addEventListener("squeeze",F),i.addEventListener("squeezestart",F),i.addEventListener("squeezeend",F),i.addEventListener("end",O),i.addEventListener("inputsourceschange",N),f.xrCompatible!==!0&&await e.makeXRCompatible(),R=t.getPixelRatio(),t.getSize(A),typeof XRWebGLBinding<"u"&&(d=new XRWebGLBinding(i,e)),d!==null&&"createProjectionLayer"in XRWebGLBinding.prototype){let rt=null,Pt=null,It=null;f.depth&&(It=f.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,rt=f.stencil?vs:_s,Pt=f.stencil?gs:vi);const Ut={colorFormat:e.RGBA8,depthFormat:It,scaleFactor:s};u=d.createProjectionLayer(Ut),i.updateRenderState({layers:[u]}),t.setPixelRatio(1),t.setSize(u.textureWidth,u.textureHeight,!1),S=new xi(u.textureWidth,u.textureHeight,{format:un,type:bn,depthTexture:new nh(u.textureWidth,u.textureHeight,Pt,void 0,void 0,void 0,void 0,void 0,void 0,rt),stencilBuffer:f.stencil,colorSpace:t.outputColorSpace,samples:f.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1})}else{const rt={antialias:f.antialias,alpha:!0,depth:f.depth,stencil:f.stencil,framebufferScaleFactor:s};p=new XRWebGLLayer(i,e,rt),i.updateRenderState({baseLayer:p}),t.setPixelRatio(1),t.setSize(p.framebufferWidth,p.framebufferHeight,!1),S=new xi(p.framebufferWidth,p.framebufferHeight,{format:un,type:bn,colorSpace:t.outputColorSpace,stencilBuffer:f.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}S.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await i.requestReferenceSpace(a),Xt.setContext(i),Xt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function N(Z){for(let lt=0;lt<Z.removed.length;lt++){const rt=Z.removed[lt],Pt=w.indexOf(rt);Pt>=0&&(w[Pt]=null,x[Pt].disconnect(rt))}for(let lt=0;lt<Z.added.length;lt++){const rt=Z.added[lt];let Pt=w.indexOf(rt);if(Pt===-1){for(let Ut=0;Ut<x.length;Ut++)if(Ut>=w.length){w.push(rt),Pt=Ut;break}else if(w[Ut]===null){w[Ut]=rt,Pt=Ut;break}if(Pt===-1)break}const It=x[Pt];It&&It.connect(rt)}}const $=new V,k=new V;function K(Z,lt,rt){$.setFromMatrixPosition(lt.matrixWorld),k.setFromMatrixPosition(rt.matrixWorld);const Pt=$.distanceTo(k),It=lt.projectionMatrix.elements,Ut=rt.projectionMatrix.elements,pe=It[14]/(It[10]-1),Wt=It[14]/(It[10]+1),D=(It[9]+1)/It[5],se=(It[9]-1)/It[5],Rt=(It[8]-1)/It[0],Zt=(Ut[8]+1)/Ut[0],wt=pe*Rt,ce=pe*Zt,xt=Pt/(-Rt+Zt),kt=xt*-Rt;if(lt.matrixWorld.decompose(Z.position,Z.quaternion,Z.scale),Z.translateX(kt),Z.translateZ(xt),Z.matrixWorld.compose(Z.position,Z.quaternion,Z.scale),Z.matrixWorldInverse.copy(Z.matrixWorld).invert(),It[10]===-1)Z.projectionMatrix.copy(lt.projectionMatrix),Z.projectionMatrixInverse.copy(lt.projectionMatrixInverse);else{const Te=pe+xt,me=Wt+xt,C=wt-kt,y=ce+(Pt-kt),G=D*Wt/me*Te,j=se*Wt/me*Te;Z.projectionMatrix.makePerspective(C,y,G,j,Te,me),Z.projectionMatrixInverse.copy(Z.projectionMatrix).invert()}}function ot(Z,lt){lt===null?Z.matrixWorld.copy(Z.matrix):Z.matrixWorld.multiplyMatrices(lt.matrixWorld,Z.matrix),Z.matrixWorldInverse.copy(Z.matrixWorld).invert()}this.updateCamera=function(Z){if(i===null)return;let lt=Z.near,rt=Z.far;_.texture!==null&&(_.depthNear>0&&(lt=_.depthNear),_.depthFar>0&&(rt=_.depthFar)),P.near=b.near=L.near=lt,P.far=b.far=L.far=rt,(H!==P.near||I!==P.far)&&(i.updateRenderState({depthNear:P.near,depthFar:P.far}),H=P.near,I=P.far),P.layers.mask=Z.layers.mask|6,L.layers.mask=P.layers.mask&3,b.layers.mask=P.layers.mask&5;const Pt=Z.parent,It=P.cameras;ot(P,Pt);for(let Ut=0;Ut<It.length;Ut++)ot(It[Ut],Pt);It.length===2?K(P,L,b):P.projectionMatrix.copy(L.projectionMatrix),pt(Z,P,Pt)};function pt(Z,lt,rt){rt===null?Z.matrix.copy(lt.matrixWorld):(Z.matrix.copy(rt.matrixWorld),Z.matrix.invert(),Z.matrix.multiply(lt.matrixWorld)),Z.matrix.decompose(Z.position,Z.quaternion,Z.scale),Z.updateMatrixWorld(!0),Z.projectionMatrix.copy(lt.projectionMatrix),Z.projectionMatrixInverse.copy(lt.projectionMatrixInverse),Z.isPerspectiveCamera&&(Z.fov=ha*2*Math.atan(1/Z.projectionMatrix.elements[5]),Z.zoom=1)}this.getCamera=function(){return P},this.getFoveation=function(){if(!(u===null&&p===null))return l},this.setFoveation=function(Z){l=Z,u!==null&&(u.fixedFoveation=Z),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=Z)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(P)},this.getCameraTexture=function(Z){return m[Z]};let st=null;function $t(Z,lt){if(h=lt.getViewerPose(c||o),g=lt,h!==null){const rt=h.views;p!==null&&(t.setRenderTargetFramebuffer(S,p.framebuffer),t.setRenderTarget(S));let Pt=!1;rt.length!==P.cameras.length&&(P.cameras.length=0,Pt=!0);for(let Wt=0;Wt<rt.length;Wt++){const D=rt[Wt];let se=null;if(p!==null)se=p.getViewport(D);else{const Zt=d.getViewSubImage(u,D);se=Zt.viewport,Wt===0&&(t.setRenderTargetTextures(S,Zt.colorTexture,Zt.depthStencilTexture),t.setRenderTarget(S))}let Rt=E[Wt];Rt===void 0&&(Rt=new sn,Rt.layers.enable(Wt),Rt.viewport=new de,E[Wt]=Rt),Rt.matrix.fromArray(D.transform.matrix),Rt.matrix.decompose(Rt.position,Rt.quaternion,Rt.scale),Rt.projectionMatrix.fromArray(D.projectionMatrix),Rt.projectionMatrixInverse.copy(Rt.projectionMatrix).invert(),Rt.viewport.set(se.x,se.y,se.width,se.height),Wt===0&&(P.matrix.copy(Rt.matrix),P.matrix.decompose(P.position,P.quaternion,P.scale)),Pt===!0&&P.cameras.push(Rt)}const It=i.enabledFeatures;if(It&&It.includes("depth-sensing")&&i.depthUsage=="gpu-optimized"&&d){const Wt=d.getDepthInformation(rt[0]);Wt&&Wt.isValid&&Wt.texture&&_.init(Wt,i.renderState)}if(It&&It.includes("camera-access")&&(t.state.unbindTexture(),d))for(let Wt=0;Wt<rt.length;Wt++){const D=rt[Wt].camera;if(D){let se=m[D];se||(se=new hh,m[D]=se);const Rt=d.getCameraImage(D);se.sourceTexture=Rt}}}for(let rt=0;rt<x.length;rt++){const Pt=w[rt],It=x[rt];Pt!==null&&It!==void 0&&It.update(Pt,lt,c||o)}st&&st(Z,lt),lt.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:lt}),g=null}const Xt=new rh;Xt.setAnimationLoop($t),this.setAnimationLoop=function(Z){st=Z},this.dispose=function(){}}}const ci=new wn,Zg=new fe;function jg(r,t){function e(m,f){m.matrixAutoUpdate===!0&&m.updateMatrix(),f.value.copy(m.matrix)}function n(m,f){f.color.getRGB(m.fogColor.value,Jl(r)),f.isFog?(m.fogNear.value=f.near,m.fogFar.value=f.far):f.isFogExp2&&(m.fogDensity.value=f.density)}function i(m,f,v,S,x){f.isMeshBasicMaterial||f.isMeshLambertMaterial?s(m,f):f.isMeshToonMaterial?(s(m,f),d(m,f)):f.isMeshPhongMaterial?(s(m,f),h(m,f)):f.isMeshStandardMaterial?(s(m,f),u(m,f),f.isMeshPhysicalMaterial&&p(m,f,x)):f.isMeshMatcapMaterial?(s(m,f),g(m,f)):f.isMeshDepthMaterial?s(m,f):f.isMeshDistanceMaterial?(s(m,f),_(m,f)):f.isMeshNormalMaterial?s(m,f):f.isLineBasicMaterial?(o(m,f),f.isLineDashedMaterial&&a(m,f)):f.isPointsMaterial?l(m,f,v,S):f.isSpriteMaterial?c(m,f):f.isShadowMaterial?(m.color.value.copy(f.color),m.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function s(m,f){m.opacity.value=f.opacity,f.color&&m.diffuse.value.copy(f.color),f.emissive&&m.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(m.map.value=f.map,e(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,e(f.alphaMap,m.alphaMapTransform)),f.bumpMap&&(m.bumpMap.value=f.bumpMap,e(f.bumpMap,m.bumpMapTransform),m.bumpScale.value=f.bumpScale,f.side===Be&&(m.bumpScale.value*=-1)),f.normalMap&&(m.normalMap.value=f.normalMap,e(f.normalMap,m.normalMapTransform),m.normalScale.value.copy(f.normalScale),f.side===Be&&m.normalScale.value.negate()),f.displacementMap&&(m.displacementMap.value=f.displacementMap,e(f.displacementMap,m.displacementMapTransform),m.displacementScale.value=f.displacementScale,m.displacementBias.value=f.displacementBias),f.emissiveMap&&(m.emissiveMap.value=f.emissiveMap,e(f.emissiveMap,m.emissiveMapTransform)),f.specularMap&&(m.specularMap.value=f.specularMap,e(f.specularMap,m.specularMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest);const v=t.get(f),S=v.envMap,x=v.envMapRotation;S&&(m.envMap.value=S,ci.copy(x),ci.x*=-1,ci.y*=-1,ci.z*=-1,S.isCubeTexture&&S.isRenderTargetTexture===!1&&(ci.y*=-1,ci.z*=-1),m.envMapRotation.value.setFromMatrix4(Zg.makeRotationFromEuler(ci)),m.flipEnvMap.value=S.isCubeTexture&&S.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=f.reflectivity,m.ior.value=f.ior,m.refractionRatio.value=f.refractionRatio),f.lightMap&&(m.lightMap.value=f.lightMap,m.lightMapIntensity.value=f.lightMapIntensity,e(f.lightMap,m.lightMapTransform)),f.aoMap&&(m.aoMap.value=f.aoMap,m.aoMapIntensity.value=f.aoMapIntensity,e(f.aoMap,m.aoMapTransform))}function o(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,f.map&&(m.map.value=f.map,e(f.map,m.mapTransform))}function a(m,f){m.dashSize.value=f.dashSize,m.totalSize.value=f.dashSize+f.gapSize,m.scale.value=f.scale}function l(m,f,v,S){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.size.value=f.size*v,m.scale.value=S*.5,f.map&&(m.map.value=f.map,e(f.map,m.uvTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,e(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function c(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.rotation.value=f.rotation,f.map&&(m.map.value=f.map,e(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,e(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function h(m,f){m.specular.value.copy(f.specular),m.shininess.value=Math.max(f.shininess,1e-4)}function d(m,f){f.gradientMap&&(m.gradientMap.value=f.gradientMap)}function u(m,f){m.metalness.value=f.metalness,f.metalnessMap&&(m.metalnessMap.value=f.metalnessMap,e(f.metalnessMap,m.metalnessMapTransform)),m.roughness.value=f.roughness,f.roughnessMap&&(m.roughnessMap.value=f.roughnessMap,e(f.roughnessMap,m.roughnessMapTransform)),f.envMap&&(m.envMapIntensity.value=f.envMapIntensity)}function p(m,f,v){m.ior.value=f.ior,f.sheen>0&&(m.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),m.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(m.sheenColorMap.value=f.sheenColorMap,e(f.sheenColorMap,m.sheenColorMapTransform)),f.sheenRoughnessMap&&(m.sheenRoughnessMap.value=f.sheenRoughnessMap,e(f.sheenRoughnessMap,m.sheenRoughnessMapTransform))),f.clearcoat>0&&(m.clearcoat.value=f.clearcoat,m.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(m.clearcoatMap.value=f.clearcoatMap,e(f.clearcoatMap,m.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,e(f.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(m.clearcoatNormalMap.value=f.clearcoatNormalMap,e(f.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===Be&&m.clearcoatNormalScale.value.negate())),f.dispersion>0&&(m.dispersion.value=f.dispersion),f.iridescence>0&&(m.iridescence.value=f.iridescence,m.iridescenceIOR.value=f.iridescenceIOR,m.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(m.iridescenceMap.value=f.iridescenceMap,e(f.iridescenceMap,m.iridescenceMapTransform)),f.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=f.iridescenceThicknessMap,e(f.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),f.transmission>0&&(m.transmission.value=f.transmission,m.transmissionSamplerMap.value=v.texture,m.transmissionSamplerSize.value.set(v.width,v.height),f.transmissionMap&&(m.transmissionMap.value=f.transmissionMap,e(f.transmissionMap,m.transmissionMapTransform)),m.thickness.value=f.thickness,f.thicknessMap&&(m.thicknessMap.value=f.thicknessMap,e(f.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=f.attenuationDistance,m.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(m.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(m.anisotropyMap.value=f.anisotropyMap,e(f.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=f.specularIntensity,m.specularColor.value.copy(f.specularColor),f.specularColorMap&&(m.specularColorMap.value=f.specularColorMap,e(f.specularColorMap,m.specularColorMapTransform)),f.specularIntensityMap&&(m.specularIntensityMap.value=f.specularIntensityMap,e(f.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,f){f.matcap&&(m.matcap.value=f.matcap)}function _(m,f){const v=t.get(f).light;m.referencePosition.value.setFromMatrixPosition(v.matrixWorld),m.nearDistance.value=v.shadow.camera.near,m.farDistance.value=v.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function Kg(r,t,e,n){let i={},s={},o=[];const a=r.getParameter(r.MAX_UNIFORM_BUFFER_BINDINGS);function l(v,S){const x=S.program;n.uniformBlockBinding(v,x)}function c(v,S){let x=i[v.id];x===void 0&&(g(v),x=h(v),i[v.id]=x,v.addEventListener("dispose",m));const w=S.program;n.updateUBOMapping(v,w);const A=t.render.frame;s[v.id]!==A&&(u(v),s[v.id]=A)}function h(v){const S=d();v.__bindingPointIndex=S;const x=r.createBuffer(),w=v.__size,A=v.usage;return r.bindBuffer(r.UNIFORM_BUFFER,x),r.bufferData(r.UNIFORM_BUFFER,w,A),r.bindBuffer(r.UNIFORM_BUFFER,null),r.bindBufferBase(r.UNIFORM_BUFFER,S,x),x}function d(){for(let v=0;v<a;v++)if(o.indexOf(v)===-1)return o.push(v),v;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(v){const S=i[v.id],x=v.uniforms,w=v.__cache;r.bindBuffer(r.UNIFORM_BUFFER,S);for(let A=0,R=x.length;A<R;A++){const L=Array.isArray(x[A])?x[A]:[x[A]];for(let b=0,E=L.length;b<E;b++){const P=L[b];if(p(P,A,b,w)===!0){const H=P.__offset,I=Array.isArray(P.value)?P.value:[P.value];let F=0;for(let O=0;O<I.length;O++){const N=I[O],$=_(N);typeof N=="number"||typeof N=="boolean"?(P.__data[0]=N,r.bufferSubData(r.UNIFORM_BUFFER,H+F,P.__data)):N.isMatrix3?(P.__data[0]=N.elements[0],P.__data[1]=N.elements[1],P.__data[2]=N.elements[2],P.__data[3]=0,P.__data[4]=N.elements[3],P.__data[5]=N.elements[4],P.__data[6]=N.elements[5],P.__data[7]=0,P.__data[8]=N.elements[6],P.__data[9]=N.elements[7],P.__data[10]=N.elements[8],P.__data[11]=0):(N.toArray(P.__data,F),F+=$.storage/Float32Array.BYTES_PER_ELEMENT)}r.bufferSubData(r.UNIFORM_BUFFER,H,P.__data)}}}r.bindBuffer(r.UNIFORM_BUFFER,null)}function p(v,S,x,w){const A=v.value,R=S+"_"+x;if(w[R]===void 0)return typeof A=="number"||typeof A=="boolean"?w[R]=A:w[R]=A.clone(),!0;{const L=w[R];if(typeof A=="number"||typeof A=="boolean"){if(L!==A)return w[R]=A,!0}else if(L.equals(A)===!1)return L.copy(A),!0}return!1}function g(v){const S=v.uniforms;let x=0;const w=16;for(let R=0,L=S.length;R<L;R++){const b=Array.isArray(S[R])?S[R]:[S[R]];for(let E=0,P=b.length;E<P;E++){const H=b[E],I=Array.isArray(H.value)?H.value:[H.value];for(let F=0,O=I.length;F<O;F++){const N=I[F],$=_(N),k=x%w,K=k%$.boundary,ot=k+K;x+=K,ot!==0&&w-ot<$.storage&&(x+=w-ot),H.__data=new Float32Array($.storage/Float32Array.BYTES_PER_ELEMENT),H.__offset=x,x+=$.storage}}}const A=x%w;return A>0&&(x+=w-A),v.__size=x,v.__cache={},this}function _(v){const S={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(S.boundary=4,S.storage=4):v.isVector2?(S.boundary=8,S.storage=8):v.isVector3||v.isColor?(S.boundary=16,S.storage=12):v.isVector4?(S.boundary=16,S.storage=16):v.isMatrix3?(S.boundary=48,S.storage=48):v.isMatrix4?(S.boundary=64,S.storage=64):v.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",v),S}function m(v){const S=v.target;S.removeEventListener("dispose",m);const x=o.indexOf(S.__bindingPointIndex);o.splice(x,1),r.deleteBuffer(i[S.id]),delete i[S.id],delete s[S.id]}function f(){for(const v in i)r.deleteBuffer(i[v]);o=[],i={},s={}}return{bind:l,update:c,dispose:f}}class Jg{constructor(t={}){const{canvas:e=Iu(),context:n=null,depth:i=!0,stencil:s=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:u=!1}=t;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=o;const g=new Uint32Array(4),_=new Int32Array(4);let m=null,f=null;const v=[],S=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Jn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const x=this;let w=!1;this._outputColorSpace=je;let A=0,R=0,L=null,b=-1,E=null;const P=new de,H=new de;let I=null;const F=new Ht(0);let O=0,N=e.width,$=e.height,k=1,K=null,ot=null;const pt=new de(0,0,N,$),st=new de(0,0,N,$);let $t=!1;const Xt=new Ta;let Z=!1,lt=!1;const rt=new fe,Pt=new V,It=new de,Ut={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let pe=!1;function Wt(){return L===null?k:1}let D=n;function se(T,z){return e.getContext(T,z)}try{const T={alpha:!0,depth:i,stencil:s,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${ma}`),e.addEventListener("webglcontextlost",ct,!1),e.addEventListener("webglcontextrestored",vt,!1),e.addEventListener("webglcontextcreationerror",tt,!1),D===null){const z="webgl2";if(D=se(z,T),D===null)throw se(z)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(T){throw console.error("THREE.WebGLRenderer: "+T.message),T}let Rt,Zt,wt,ce,xt,kt,Te,me,C,y,G,j,Q,Y,bt,at,St,Et,nt,ft,Dt,Tt,ut,Ot;function U(){Rt=new cm(D),Rt.init(),Tt=new Wg(D,Rt),Zt=new em(D,Rt,t,Tt),wt=new Gg(D,Rt),Zt.reversedDepthBuffer&&u&&wt.buffers.depth.setReversed(!0),ce=new um(D),xt=new Cg,kt=new Hg(D,Rt,wt,xt,Zt,Tt,ce),Te=new im(x),me=new am(x),C=new gd(D),ut=new Qp(D,C),y=new lm(D,C,ce,ut),G=new fm(D,y,C,ce),nt=new dm(D,Zt,kt),at=new nm(xt),j=new Rg(x,Te,me,Rt,Zt,ut,at),Q=new jg(x,xt),Y=new Ig,bt=new Og(Rt),Et=new Jp(x,Te,me,wt,G,p,l),St=new kg(x,G,Zt),Ot=new Kg(D,ce,Zt,wt),ft=new tm(D,Rt,ce),Dt=new hm(D,Rt,ce),ce.programs=j.programs,x.capabilities=Zt,x.extensions=Rt,x.properties=xt,x.renderLists=Y,x.shadowMap=St,x.state=wt,x.info=ce}U();const it=new $g(x,D);this.xr=it,this.getContext=function(){return D},this.getContextAttributes=function(){return D.getContextAttributes()},this.forceContextLoss=function(){const T=Rt.get("WEBGL_lose_context");T&&T.loseContext()},this.forceContextRestore=function(){const T=Rt.get("WEBGL_lose_context");T&&T.restoreContext()},this.getPixelRatio=function(){return k},this.setPixelRatio=function(T){T!==void 0&&(k=T,this.setSize(N,$,!1))},this.getSize=function(T){return T.set(N,$)},this.setSize=function(T,z,W=!0){if(it.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}N=T,$=z,e.width=Math.floor(T*k),e.height=Math.floor(z*k),W===!0&&(e.style.width=T+"px",e.style.height=z+"px"),this.setViewport(0,0,T,z)},this.getDrawingBufferSize=function(T){return T.set(N*k,$*k).floor()},this.setDrawingBufferSize=function(T,z,W){N=T,$=z,k=W,e.width=Math.floor(T*W),e.height=Math.floor(z*W),this.setViewport(0,0,T,z)},this.getCurrentViewport=function(T){return T.copy(P)},this.getViewport=function(T){return T.copy(pt)},this.setViewport=function(T,z,W,X){T.isVector4?pt.set(T.x,T.y,T.z,T.w):pt.set(T,z,W,X),wt.viewport(P.copy(pt).multiplyScalar(k).round())},this.getScissor=function(T){return T.copy(st)},this.setScissor=function(T,z,W,X){T.isVector4?st.set(T.x,T.y,T.z,T.w):st.set(T,z,W,X),wt.scissor(H.copy(st).multiplyScalar(k).round())},this.getScissorTest=function(){return $t},this.setScissorTest=function(T){wt.setScissorTest($t=T)},this.setOpaqueSort=function(T){K=T},this.setTransparentSort=function(T){ot=T},this.getClearColor=function(T){return T.copy(Et.getClearColor())},this.setClearColor=function(){Et.setClearColor(...arguments)},this.getClearAlpha=function(){return Et.getClearAlpha()},this.setClearAlpha=function(){Et.setClearAlpha(...arguments)},this.clear=function(T=!0,z=!0,W=!0){let X=0;if(T){let B=!1;if(L!==null){const et=L.texture.format;B=et===Ma||et===ya||et===xa}if(B){const et=L.texture.type,dt=et===bn||et===vi||et===ms||et===gs||et===_a||et===va,yt=Et.getClearColor(),mt=Et.getClearAlpha(),Lt=yt.r,Nt=yt.g,At=yt.b;dt?(g[0]=Lt,g[1]=Nt,g[2]=At,g[3]=mt,D.clearBufferuiv(D.COLOR,0,g)):(_[0]=Lt,_[1]=Nt,_[2]=At,_[3]=mt,D.clearBufferiv(D.COLOR,0,_))}else X|=D.COLOR_BUFFER_BIT}z&&(X|=D.DEPTH_BUFFER_BIT),W&&(X|=D.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),D.clear(X)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",ct,!1),e.removeEventListener("webglcontextrestored",vt,!1),e.removeEventListener("webglcontextcreationerror",tt,!1),Et.dispose(),Y.dispose(),bt.dispose(),xt.dispose(),Te.dispose(),me.dispose(),G.dispose(),ut.dispose(),Ot.dispose(),j.dispose(),it.dispose(),it.removeEventListener("sessionstart",pn),it.removeEventListener("sessionend",Oa),ei.stop()};function ct(T){T.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),w=!0}function vt(){console.log("THREE.WebGLRenderer: Context Restored."),w=!1;const T=ce.autoReset,z=St.enabled,W=St.autoUpdate,X=St.needsUpdate,B=St.type;U(),ce.autoReset=T,St.enabled=z,St.autoUpdate=W,St.needsUpdate=X,St.type=B}function tt(T){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",T.statusMessage)}function J(T){const z=T.target;z.removeEventListener("dispose",J),Mt(z)}function Mt(T){Ft(T),xt.remove(T)}function Ft(T){const z=xt.get(T).programs;z!==void 0&&(z.forEach(function(W){j.releaseProgram(W)}),T.isShaderMaterial&&j.releaseShaderCache(T))}this.renderBufferDirect=function(T,z,W,X,B,et){z===null&&(z=Ut);const dt=B.isMesh&&B.matrixWorld.determinant()<0,yt=Oh(T,z,W,X,B);wt.setMaterial(X,dt);let mt=W.index,Lt=1;if(X.wireframe===!0){if(mt=y.getWireframeAttribute(W),mt===void 0)return;Lt=2}const Nt=W.drawRange,At=W.attributes.position;let Vt=Nt.start*Lt,te=(Nt.start+Nt.count)*Lt;et!==null&&(Vt=Math.max(Vt,et.start*Lt),te=Math.min(te,(et.start+et.count)*Lt)),mt!==null?(Vt=Math.max(Vt,0),te=Math.min(te,mt.count)):At!=null&&(Vt=Math.max(Vt,0),te=Math.min(te,At.count));const ue=te-Vt;if(ue<0||ue===1/0)return;ut.setup(B,X,yt,W,mt);let oe,ie=ft;if(mt!==null&&(oe=C.get(mt),ie=Dt,ie.setIndex(oe)),B.isMesh)X.wireframe===!0?(wt.setLineWidth(X.wireframeLinewidth*Wt()),ie.setMode(D.LINES)):ie.setMode(D.TRIANGLES);else if(B.isLine){let Ct=X.linewidth;Ct===void 0&&(Ct=1),wt.setLineWidth(Ct*Wt()),B.isLineSegments?ie.setMode(D.LINES):B.isLineLoop?ie.setMode(D.LINE_LOOP):ie.setMode(D.LINE_STRIP)}else B.isPoints?ie.setMode(D.POINTS):B.isSprite&&ie.setMode(D.TRIANGLES);if(B.isBatchedMesh)if(B._multiDrawInstances!==null)Vi("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),ie.renderMultiDrawInstances(B._multiDrawStarts,B._multiDrawCounts,B._multiDrawCount,B._multiDrawInstances);else if(Rt.get("WEBGL_multi_draw"))ie.renderMultiDraw(B._multiDrawStarts,B._multiDrawCounts,B._multiDrawCount);else{const Ct=B._multiDrawStarts,le=B._multiDrawCounts,qt=B._multiDrawCount,Xe=mt?C.get(mt).bytesPerElement:1,yi=xt.get(X).currentProgram.getUniforms();for(let qe=0;qe<qt;qe++)yi.setValue(D,"_gl_DrawID",qe),ie.render(Ct[qe]/Xe,le[qe])}else if(B.isInstancedMesh)ie.renderInstances(Vt,ue,B.count);else if(W.isInstancedBufferGeometry){const Ct=W._maxInstanceCount!==void 0?W._maxInstanceCount:1/0,le=Math.min(W.instanceCount,Ct);ie.renderInstances(Vt,ue,le)}else ie.render(Vt,ue)};function re(T,z,W){T.transparent===!0&&T.side===Bn&&T.forceSinglePass===!1?(T.side=Be,T.needsUpdate=!0,Rs(T,z,W),T.side=Qn,T.needsUpdate=!0,Rs(T,z,W),T.side=Bn):Rs(T,z,W)}this.compile=function(T,z,W=null){W===null&&(W=T),f=bt.get(W),f.init(z),S.push(f),W.traverseVisible(function(B){B.isLight&&B.layers.test(z.layers)&&(f.pushLight(B),B.castShadow&&f.pushShadow(B))}),T!==W&&T.traverseVisible(function(B){B.isLight&&B.layers.test(z.layers)&&(f.pushLight(B),B.castShadow&&f.pushShadow(B))}),f.setupLights();const X=new Set;return T.traverse(function(B){if(!(B.isMesh||B.isPoints||B.isLine||B.isSprite))return;const et=B.material;if(et)if(Array.isArray(et))for(let dt=0;dt<et.length;dt++){const yt=et[dt];re(yt,W,B),X.add(yt)}else re(et,W,B),X.add(et)}),f=S.pop(),X},this.compileAsync=function(T,z,W=null){const X=this.compile(T,z,W);return new Promise(B=>{function et(){if(X.forEach(function(dt){xt.get(dt).currentProgram.isReady()&&X.delete(dt)}),X.size===0){B(T);return}setTimeout(et,10)}Rt.get("KHR_parallel_shader_compile")!==null?et():setTimeout(et,10)})};let Jt=null;function An(T){Jt&&Jt(T)}function pn(){ei.stop()}function Oa(){ei.start()}const ei=new rh;ei.setAnimationLoop(An),typeof self<"u"&&ei.setContext(self),this.setAnimationLoop=function(T){Jt=T,it.setAnimationLoop(T),T===null?ei.stop():ei.start()},it.addEventListener("sessionstart",pn),it.addEventListener("sessionend",Oa),this.render=function(T,z){if(z!==void 0&&z.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(w===!0)return;if(T.matrixWorldAutoUpdate===!0&&T.updateMatrixWorld(),z.parent===null&&z.matrixWorldAutoUpdate===!0&&z.updateMatrixWorld(),it.enabled===!0&&it.isPresenting===!0&&(it.cameraAutoUpdate===!0&&it.updateCamera(z),z=it.getCamera()),T.isScene===!0&&T.onBeforeRender(x,T,z,L),f=bt.get(T,S.length),f.init(z),S.push(f),rt.multiplyMatrices(z.projectionMatrix,z.matrixWorldInverse),Xt.setFromProjectionMatrix(rt,En,z.reversedDepth),lt=this.localClippingEnabled,Z=at.init(this.clippingPlanes,lt),m=Y.get(T,v.length),m.init(),v.push(m),it.enabled===!0&&it.isPresenting===!0){const et=x.xr.getDepthSensingMesh();et!==null&&Cr(et,z,-1/0,x.sortObjects)}Cr(T,z,0,x.sortObjects),m.finish(),x.sortObjects===!0&&m.sort(K,ot),pe=it.enabled===!1||it.isPresenting===!1||it.hasDepthSensing()===!1,pe&&Et.addToRenderList(m,T),this.info.render.frame++,Z===!0&&at.beginShadows();const W=f.state.shadowsArray;St.render(W,T,z),Z===!0&&at.endShadows(),this.info.autoReset===!0&&this.info.reset();const X=m.opaque,B=m.transmissive;if(f.setupLights(),z.isArrayCamera){const et=z.cameras;if(B.length>0)for(let dt=0,yt=et.length;dt<yt;dt++){const mt=et[dt];Ba(X,B,T,mt)}pe&&Et.render(T);for(let dt=0,yt=et.length;dt<yt;dt++){const mt=et[dt];za(m,T,mt,mt.viewport)}}else B.length>0&&Ba(X,B,T,z),pe&&Et.render(T),za(m,T,z);L!==null&&R===0&&(kt.updateMultisampleRenderTarget(L),kt.updateRenderTargetMipmap(L)),T.isScene===!0&&T.onAfterRender(x,T,z),ut.resetDefaultState(),b=-1,E=null,S.pop(),S.length>0?(f=S[S.length-1],Z===!0&&at.setGlobalState(x.clippingPlanes,f.state.camera)):f=null,v.pop(),v.length>0?m=v[v.length-1]:m=null};function Cr(T,z,W,X){if(T.visible===!1)return;if(T.layers.test(z.layers)){if(T.isGroup)W=T.renderOrder;else if(T.isLOD)T.autoUpdate===!0&&T.update(z);else if(T.isLight)f.pushLight(T),T.castShadow&&f.pushShadow(T);else if(T.isSprite){if(!T.frustumCulled||Xt.intersectsSprite(T)){X&&It.setFromMatrixPosition(T.matrixWorld).applyMatrix4(rt);const dt=G.update(T),yt=T.material;yt.visible&&m.push(T,dt,yt,W,It.z,null)}}else if((T.isMesh||T.isLine||T.isPoints)&&(!T.frustumCulled||Xt.intersectsObject(T))){const dt=G.update(T),yt=T.material;if(X&&(T.boundingSphere!==void 0?(T.boundingSphere===null&&T.computeBoundingSphere(),It.copy(T.boundingSphere.center)):(dt.boundingSphere===null&&dt.computeBoundingSphere(),It.copy(dt.boundingSphere.center)),It.applyMatrix4(T.matrixWorld).applyMatrix4(rt)),Array.isArray(yt)){const mt=dt.groups;for(let Lt=0,Nt=mt.length;Lt<Nt;Lt++){const At=mt[Lt],Vt=yt[At.materialIndex];Vt&&Vt.visible&&m.push(T,dt,Vt,W,It.z,At)}}else yt.visible&&m.push(T,dt,yt,W,It.z,null)}}const et=T.children;for(let dt=0,yt=et.length;dt<yt;dt++)Cr(et[dt],z,W,X)}function za(T,z,W,X){const B=T.opaque,et=T.transmissive,dt=T.transparent;f.setupLightsView(W),Z===!0&&at.setGlobalState(x.clippingPlanes,W),X&&wt.viewport(P.copy(X)),B.length>0&&As(B,z,W),et.length>0&&As(et,z,W),dt.length>0&&As(dt,z,W),wt.buffers.depth.setTest(!0),wt.buffers.depth.setMask(!0),wt.buffers.color.setMask(!0),wt.setPolygonOffset(!1)}function Ba(T,z,W,X){if((W.isScene===!0?W.overrideMaterial:null)!==null)return;f.state.transmissionRenderTarget[X.id]===void 0&&(f.state.transmissionRenderTarget[X.id]=new xi(1,1,{generateMipmaps:!0,type:Rt.has("EXT_color_buffer_half_float")||Rt.has("EXT_color_buffer_float")?Ms:bn,minFilter:_i,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Yt.workingColorSpace}));const et=f.state.transmissionRenderTarget[X.id],dt=X.viewport||P;et.setSize(dt.z*x.transmissionResolutionScale,dt.w*x.transmissionResolutionScale);const yt=x.getRenderTarget(),mt=x.getActiveCubeFace(),Lt=x.getActiveMipmapLevel();x.setRenderTarget(et),x.getClearColor(F),O=x.getClearAlpha(),O<1&&x.setClearColor(16777215,.5),x.clear(),pe&&Et.render(W);const Nt=x.toneMapping;x.toneMapping=Jn;const At=X.viewport;if(X.viewport!==void 0&&(X.viewport=void 0),f.setupLightsView(X),Z===!0&&at.setGlobalState(x.clippingPlanes,X),As(T,W,X),kt.updateMultisampleRenderTarget(et),kt.updateRenderTargetMipmap(et),Rt.has("WEBGL_multisampled_render_to_texture")===!1){let Vt=!1;for(let te=0,ue=z.length;te<ue;te++){const oe=z[te],ie=oe.object,Ct=oe.geometry,le=oe.material,qt=oe.group;if(le.side===Bn&&ie.layers.test(X.layers)){const Xe=le.side;le.side=Be,le.needsUpdate=!0,ka(ie,W,X,Ct,le,qt),le.side=Xe,le.needsUpdate=!0,Vt=!0}}Vt===!0&&(kt.updateMultisampleRenderTarget(et),kt.updateRenderTargetMipmap(et))}x.setRenderTarget(yt,mt,Lt),x.setClearColor(F,O),At!==void 0&&(X.viewport=At),x.toneMapping=Nt}function As(T,z,W){const X=z.isScene===!0?z.overrideMaterial:null;for(let B=0,et=T.length;B<et;B++){const dt=T[B],yt=dt.object,mt=dt.geometry,Lt=dt.group;let Nt=dt.material;Nt.allowOverride===!0&&X!==null&&(Nt=X),yt.layers.test(W.layers)&&ka(yt,z,W,mt,Nt,Lt)}}function ka(T,z,W,X,B,et){T.onBeforeRender(x,z,W,X,B,et),T.modelViewMatrix.multiplyMatrices(W.matrixWorldInverse,T.matrixWorld),T.normalMatrix.getNormalMatrix(T.modelViewMatrix),B.onBeforeRender(x,z,W,X,T,et),B.transparent===!0&&B.side===Bn&&B.forceSinglePass===!1?(B.side=Be,B.needsUpdate=!0,x.renderBufferDirect(W,z,X,B,T,et),B.side=Qn,B.needsUpdate=!0,x.renderBufferDirect(W,z,X,B,T,et),B.side=Bn):x.renderBufferDirect(W,z,X,B,T,et),T.onAfterRender(x,z,W,X,B,et)}function Rs(T,z,W){z.isScene!==!0&&(z=Ut);const X=xt.get(T),B=f.state.lights,et=f.state.shadowsArray,dt=B.state.version,yt=j.getParameters(T,B.state,et,z,W),mt=j.getProgramCacheKey(yt);let Lt=X.programs;X.environment=T.isMeshStandardMaterial?z.environment:null,X.fog=z.fog,X.envMap=(T.isMeshStandardMaterial?me:Te).get(T.envMap||X.environment),X.envMapRotation=X.environment!==null&&T.envMap===null?z.environmentRotation:T.envMapRotation,Lt===void 0&&(T.addEventListener("dispose",J),Lt=new Map,X.programs=Lt);let Nt=Lt.get(mt);if(Nt!==void 0){if(X.currentProgram===Nt&&X.lightsStateVersion===dt)return Ga(T,yt),Nt}else yt.uniforms=j.getUniforms(T),T.onBeforeCompile(yt,x),Nt=j.acquireProgram(yt,mt),Lt.set(mt,Nt),X.uniforms=yt.uniforms;const At=X.uniforms;return(!T.isShaderMaterial&&!T.isRawShaderMaterial||T.clipping===!0)&&(At.clippingPlanes=at.uniform),Ga(T,yt),X.needsLights=Bh(T),X.lightsStateVersion=dt,X.needsLights&&(At.ambientLightColor.value=B.state.ambient,At.lightProbe.value=B.state.probe,At.directionalLights.value=B.state.directional,At.directionalLightShadows.value=B.state.directionalShadow,At.spotLights.value=B.state.spot,At.spotLightShadows.value=B.state.spotShadow,At.rectAreaLights.value=B.state.rectArea,At.ltc_1.value=B.state.rectAreaLTC1,At.ltc_2.value=B.state.rectAreaLTC2,At.pointLights.value=B.state.point,At.pointLightShadows.value=B.state.pointShadow,At.hemisphereLights.value=B.state.hemi,At.directionalShadowMap.value=B.state.directionalShadowMap,At.directionalShadowMatrix.value=B.state.directionalShadowMatrix,At.spotShadowMap.value=B.state.spotShadowMap,At.spotLightMatrix.value=B.state.spotLightMatrix,At.spotLightMap.value=B.state.spotLightMap,At.pointShadowMap.value=B.state.pointShadowMap,At.pointShadowMatrix.value=B.state.pointShadowMatrix),X.currentProgram=Nt,X.uniformsList=null,Nt}function Va(T){if(T.uniformsList===null){const z=T.currentProgram.getUniforms();T.uniformsList=fr.seqWithValue(z.seq,T.uniforms)}return T.uniformsList}function Ga(T,z){const W=xt.get(T);W.outputColorSpace=z.outputColorSpace,W.batching=z.batching,W.batchingColor=z.batchingColor,W.instancing=z.instancing,W.instancingColor=z.instancingColor,W.instancingMorph=z.instancingMorph,W.skinning=z.skinning,W.morphTargets=z.morphTargets,W.morphNormals=z.morphNormals,W.morphColors=z.morphColors,W.morphTargetsCount=z.morphTargetsCount,W.numClippingPlanes=z.numClippingPlanes,W.numIntersection=z.numClipIntersection,W.vertexAlphas=z.vertexAlphas,W.vertexTangents=z.vertexTangents,W.toneMapping=z.toneMapping}function Oh(T,z,W,X,B){z.isScene!==!0&&(z=Ut),kt.resetTextureUnits();const et=z.fog,dt=X.isMeshStandardMaterial?z.environment:null,yt=L===null?x.outputColorSpace:L.isXRRenderTarget===!0?L.texture.colorSpace:Yi,mt=(X.isMeshStandardMaterial?me:Te).get(X.envMap||dt),Lt=X.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,Nt=!!W.attributes.tangent&&(!!X.normalMap||X.anisotropy>0),At=!!W.morphAttributes.position,Vt=!!W.morphAttributes.normal,te=!!W.morphAttributes.color;let ue=Jn;X.toneMapped&&(L===null||L.isXRRenderTarget===!0)&&(ue=x.toneMapping);const oe=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,ie=oe!==void 0?oe.length:0,Ct=xt.get(X),le=f.state.lights;if(Z===!0&&(lt===!0||T!==E)){const De=T===E&&X.id===b;at.setState(X,T,De)}let qt=!1;X.version===Ct.__version?(Ct.needsLights&&Ct.lightsStateVersion!==le.state.version||Ct.outputColorSpace!==yt||B.isBatchedMesh&&Ct.batching===!1||!B.isBatchedMesh&&Ct.batching===!0||B.isBatchedMesh&&Ct.batchingColor===!0&&B.colorTexture===null||B.isBatchedMesh&&Ct.batchingColor===!1&&B.colorTexture!==null||B.isInstancedMesh&&Ct.instancing===!1||!B.isInstancedMesh&&Ct.instancing===!0||B.isSkinnedMesh&&Ct.skinning===!1||!B.isSkinnedMesh&&Ct.skinning===!0||B.isInstancedMesh&&Ct.instancingColor===!0&&B.instanceColor===null||B.isInstancedMesh&&Ct.instancingColor===!1&&B.instanceColor!==null||B.isInstancedMesh&&Ct.instancingMorph===!0&&B.morphTexture===null||B.isInstancedMesh&&Ct.instancingMorph===!1&&B.morphTexture!==null||Ct.envMap!==mt||X.fog===!0&&Ct.fog!==et||Ct.numClippingPlanes!==void 0&&(Ct.numClippingPlanes!==at.numPlanes||Ct.numIntersection!==at.numIntersection)||Ct.vertexAlphas!==Lt||Ct.vertexTangents!==Nt||Ct.morphTargets!==At||Ct.morphNormals!==Vt||Ct.morphColors!==te||Ct.toneMapping!==ue||Ct.morphTargetsCount!==ie)&&(qt=!0):(qt=!0,Ct.__version=X.version);let Xe=Ct.currentProgram;qt===!0&&(Xe=Rs(X,z,B));let yi=!1,qe=!1,Qi=!1;const he=Xe.getUniforms(),Je=Ct.uniforms;if(wt.useProgram(Xe.program)&&(yi=!0,qe=!0,Qi=!0),X.id!==b&&(b=X.id,qe=!0),yi||E!==T){wt.buffers.depth.getReversed()&&T.reversedDepth!==!0&&(T._reversedDepth=!0,T.updateProjectionMatrix()),he.setValue(D,"projectionMatrix",T.projectionMatrix),he.setValue(D,"viewMatrix",T.matrixWorldInverse);const ke=he.map.cameraPosition;ke!==void 0&&ke.setValue(D,Pt.setFromMatrixPosition(T.matrixWorld)),Zt.logarithmicDepthBuffer&&he.setValue(D,"logDepthBufFC",2/(Math.log(T.far+1)/Math.LN2)),(X.isMeshPhongMaterial||X.isMeshToonMaterial||X.isMeshLambertMaterial||X.isMeshBasicMaterial||X.isMeshStandardMaterial||X.isShaderMaterial)&&he.setValue(D,"isOrthographic",T.isOrthographicCamera===!0),E!==T&&(E=T,qe=!0,Qi=!0)}if(B.isSkinnedMesh){he.setOptional(D,B,"bindMatrix"),he.setOptional(D,B,"bindMatrixInverse");const De=B.skeleton;De&&(De.boneTexture===null&&De.computeBoneTexture(),he.setValue(D,"boneTexture",De.boneTexture,kt))}B.isBatchedMesh&&(he.setOptional(D,B,"batchingTexture"),he.setValue(D,"batchingTexture",B._matricesTexture,kt),he.setOptional(D,B,"batchingIdTexture"),he.setValue(D,"batchingIdTexture",B._indirectTexture,kt),he.setOptional(D,B,"batchingColorTexture"),B._colorsTexture!==null&&he.setValue(D,"batchingColorTexture",B._colorsTexture,kt));const Qe=W.morphAttributes;if((Qe.position!==void 0||Qe.normal!==void 0||Qe.color!==void 0)&&nt.update(B,W,Xe),(qe||Ct.receiveShadow!==B.receiveShadow)&&(Ct.receiveShadow=B.receiveShadow,he.setValue(D,"receiveShadow",B.receiveShadow)),X.isMeshGouraudMaterial&&X.envMap!==null&&(Je.envMap.value=mt,Je.flipEnvMap.value=mt.isCubeTexture&&mt.isRenderTargetTexture===!1?-1:1),X.isMeshStandardMaterial&&X.envMap===null&&z.environment!==null&&(Je.envMapIntensity.value=z.environmentIntensity),qe&&(he.setValue(D,"toneMappingExposure",x.toneMappingExposure),Ct.needsLights&&zh(Je,Qi),et&&X.fog===!0&&Q.refreshFogUniforms(Je,et),Q.refreshMaterialUniforms(Je,X,k,$,f.state.transmissionRenderTarget[T.id]),fr.upload(D,Va(Ct),Je,kt)),X.isShaderMaterial&&X.uniformsNeedUpdate===!0&&(fr.upload(D,Va(Ct),Je,kt),X.uniformsNeedUpdate=!1),X.isSpriteMaterial&&he.setValue(D,"center",B.center),he.setValue(D,"modelViewMatrix",B.modelViewMatrix),he.setValue(D,"normalMatrix",B.normalMatrix),he.setValue(D,"modelMatrix",B.matrixWorld),X.isShaderMaterial||X.isRawShaderMaterial){const De=X.uniformsGroups;for(let ke=0,Pr=De.length;ke<Pr;ke++){const ni=De[ke];Ot.update(ni,Xe),Ot.bind(ni,Xe)}}return Xe}function zh(T,z){T.ambientLightColor.needsUpdate=z,T.lightProbe.needsUpdate=z,T.directionalLights.needsUpdate=z,T.directionalLightShadows.needsUpdate=z,T.pointLights.needsUpdate=z,T.pointLightShadows.needsUpdate=z,T.spotLights.needsUpdate=z,T.spotLightShadows.needsUpdate=z,T.rectAreaLights.needsUpdate=z,T.hemisphereLights.needsUpdate=z}function Bh(T){return T.isMeshLambertMaterial||T.isMeshToonMaterial||T.isMeshPhongMaterial||T.isMeshStandardMaterial||T.isShadowMaterial||T.isShaderMaterial&&T.lights===!0}this.getActiveCubeFace=function(){return A},this.getActiveMipmapLevel=function(){return R},this.getRenderTarget=function(){return L},this.setRenderTargetTextures=function(T,z,W){const X=xt.get(T);X.__autoAllocateDepthBuffer=T.resolveDepthBuffer===!1,X.__autoAllocateDepthBuffer===!1&&(X.__useRenderToTexture=!1),xt.get(T.texture).__webglTexture=z,xt.get(T.depthTexture).__webglTexture=X.__autoAllocateDepthBuffer?void 0:W,X.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(T,z){const W=xt.get(T);W.__webglFramebuffer=z,W.__useDefaultFramebuffer=z===void 0};const kh=D.createFramebuffer();this.setRenderTarget=function(T,z=0,W=0){L=T,A=z,R=W;let X=!0,B=null,et=!1,dt=!1;if(T){const mt=xt.get(T);if(mt.__useDefaultFramebuffer!==void 0)wt.bindFramebuffer(D.FRAMEBUFFER,null),X=!1;else if(mt.__webglFramebuffer===void 0)kt.setupRenderTarget(T);else if(mt.__hasExternalTextures)kt.rebindTextures(T,xt.get(T.texture).__webglTexture,xt.get(T.depthTexture).__webglTexture);else if(T.depthBuffer){const At=T.depthTexture;if(mt.__boundDepthTexture!==At){if(At!==null&&xt.has(At)&&(T.width!==At.image.width||T.height!==At.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");kt.setupDepthRenderbuffer(T)}}const Lt=T.texture;(Lt.isData3DTexture||Lt.isDataArrayTexture||Lt.isCompressedArrayTexture)&&(dt=!0);const Nt=xt.get(T).__webglFramebuffer;T.isWebGLCubeRenderTarget?(Array.isArray(Nt[z])?B=Nt[z][W]:B=Nt[z],et=!0):T.samples>0&&kt.useMultisampledRTT(T)===!1?B=xt.get(T).__webglMultisampledFramebuffer:Array.isArray(Nt)?B=Nt[W]:B=Nt,P.copy(T.viewport),H.copy(T.scissor),I=T.scissorTest}else P.copy(pt).multiplyScalar(k).floor(),H.copy(st).multiplyScalar(k).floor(),I=$t;if(W!==0&&(B=kh),wt.bindFramebuffer(D.FRAMEBUFFER,B)&&X&&wt.drawBuffers(T,B),wt.viewport(P),wt.scissor(H),wt.setScissorTest(I),et){const mt=xt.get(T.texture);D.framebufferTexture2D(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_CUBE_MAP_POSITIVE_X+z,mt.__webglTexture,W)}else if(dt){const mt=z;for(let Lt=0;Lt<T.textures.length;Lt++){const Nt=xt.get(T.textures[Lt]);D.framebufferTextureLayer(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0+Lt,Nt.__webglTexture,W,mt)}}else if(T!==null&&W!==0){const mt=xt.get(T.texture);D.framebufferTexture2D(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_2D,mt.__webglTexture,W)}b=-1},this.readRenderTargetPixels=function(T,z,W,X,B,et,dt,yt=0){if(!(T&&T.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let mt=xt.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&dt!==void 0&&(mt=mt[dt]),mt){wt.bindFramebuffer(D.FRAMEBUFFER,mt);try{const Lt=T.textures[yt],Nt=Lt.format,At=Lt.type;if(!Zt.textureFormatReadable(Nt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Zt.textureTypeReadable(At)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}z>=0&&z<=T.width-X&&W>=0&&W<=T.height-B&&(T.textures.length>1&&D.readBuffer(D.COLOR_ATTACHMENT0+yt),D.readPixels(z,W,X,B,Tt.convert(Nt),Tt.convert(At),et))}finally{const Lt=L!==null?xt.get(L).__webglFramebuffer:null;wt.bindFramebuffer(D.FRAMEBUFFER,Lt)}}},this.readRenderTargetPixelsAsync=async function(T,z,W,X,B,et,dt,yt=0){if(!(T&&T.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let mt=xt.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&dt!==void 0&&(mt=mt[dt]),mt)if(z>=0&&z<=T.width-X&&W>=0&&W<=T.height-B){wt.bindFramebuffer(D.FRAMEBUFFER,mt);const Lt=T.textures[yt],Nt=Lt.format,At=Lt.type;if(!Zt.textureFormatReadable(Nt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Zt.textureTypeReadable(At))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Vt=D.createBuffer();D.bindBuffer(D.PIXEL_PACK_BUFFER,Vt),D.bufferData(D.PIXEL_PACK_BUFFER,et.byteLength,D.STREAM_READ),T.textures.length>1&&D.readBuffer(D.COLOR_ATTACHMENT0+yt),D.readPixels(z,W,X,B,Tt.convert(Nt),Tt.convert(At),0);const te=L!==null?xt.get(L).__webglFramebuffer:null;wt.bindFramebuffer(D.FRAMEBUFFER,te);const ue=D.fenceSync(D.SYNC_GPU_COMMANDS_COMPLETE,0);return D.flush(),await Lu(D,ue,4),D.bindBuffer(D.PIXEL_PACK_BUFFER,Vt),D.getBufferSubData(D.PIXEL_PACK_BUFFER,0,et),D.deleteBuffer(Vt),D.deleteSync(ue),et}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(T,z=null,W=0){const X=Math.pow(2,-W),B=Math.floor(T.image.width*X),et=Math.floor(T.image.height*X),dt=z!==null?z.x:0,yt=z!==null?z.y:0;kt.setTexture2D(T,0),D.copyTexSubImage2D(D.TEXTURE_2D,W,0,0,dt,yt,B,et),wt.unbindTexture()};const Vh=D.createFramebuffer(),Gh=D.createFramebuffer();this.copyTextureToTexture=function(T,z,W=null,X=null,B=0,et=null){et===null&&(B!==0?(Vi("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),et=B,B=0):et=0);let dt,yt,mt,Lt,Nt,At,Vt,te,ue;const oe=T.isCompressedTexture?T.mipmaps[et]:T.image;if(W!==null)dt=W.max.x-W.min.x,yt=W.max.y-W.min.y,mt=W.isBox3?W.max.z-W.min.z:1,Lt=W.min.x,Nt=W.min.y,At=W.isBox3?W.min.z:0;else{const Qe=Math.pow(2,-B);dt=Math.floor(oe.width*Qe),yt=Math.floor(oe.height*Qe),T.isDataArrayTexture?mt=oe.depth:T.isData3DTexture?mt=Math.floor(oe.depth*Qe):mt=1,Lt=0,Nt=0,At=0}X!==null?(Vt=X.x,te=X.y,ue=X.z):(Vt=0,te=0,ue=0);const ie=Tt.convert(z.format),Ct=Tt.convert(z.type);let le;z.isData3DTexture?(kt.setTexture3D(z,0),le=D.TEXTURE_3D):z.isDataArrayTexture||z.isCompressedArrayTexture?(kt.setTexture2DArray(z,0),le=D.TEXTURE_2D_ARRAY):(kt.setTexture2D(z,0),le=D.TEXTURE_2D),D.pixelStorei(D.UNPACK_FLIP_Y_WEBGL,z.flipY),D.pixelStorei(D.UNPACK_PREMULTIPLY_ALPHA_WEBGL,z.premultiplyAlpha),D.pixelStorei(D.UNPACK_ALIGNMENT,z.unpackAlignment);const qt=D.getParameter(D.UNPACK_ROW_LENGTH),Xe=D.getParameter(D.UNPACK_IMAGE_HEIGHT),yi=D.getParameter(D.UNPACK_SKIP_PIXELS),qe=D.getParameter(D.UNPACK_SKIP_ROWS),Qi=D.getParameter(D.UNPACK_SKIP_IMAGES);D.pixelStorei(D.UNPACK_ROW_LENGTH,oe.width),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,oe.height),D.pixelStorei(D.UNPACK_SKIP_PIXELS,Lt),D.pixelStorei(D.UNPACK_SKIP_ROWS,Nt),D.pixelStorei(D.UNPACK_SKIP_IMAGES,At);const he=T.isDataArrayTexture||T.isData3DTexture,Je=z.isDataArrayTexture||z.isData3DTexture;if(T.isDepthTexture){const Qe=xt.get(T),De=xt.get(z),ke=xt.get(Qe.__renderTarget),Pr=xt.get(De.__renderTarget);wt.bindFramebuffer(D.READ_FRAMEBUFFER,ke.__webglFramebuffer),wt.bindFramebuffer(D.DRAW_FRAMEBUFFER,Pr.__webglFramebuffer);for(let ni=0;ni<mt;ni++)he&&(D.framebufferTextureLayer(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,xt.get(T).__webglTexture,B,At+ni),D.framebufferTextureLayer(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,xt.get(z).__webglTexture,et,ue+ni)),D.blitFramebuffer(Lt,Nt,dt,yt,Vt,te,dt,yt,D.DEPTH_BUFFER_BIT,D.NEAREST);wt.bindFramebuffer(D.READ_FRAMEBUFFER,null),wt.bindFramebuffer(D.DRAW_FRAMEBUFFER,null)}else if(B!==0||T.isRenderTargetTexture||xt.has(T)){const Qe=xt.get(T),De=xt.get(z);wt.bindFramebuffer(D.READ_FRAMEBUFFER,Vh),wt.bindFramebuffer(D.DRAW_FRAMEBUFFER,Gh);for(let ke=0;ke<mt;ke++)he?D.framebufferTextureLayer(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,Qe.__webglTexture,B,At+ke):D.framebufferTexture2D(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_2D,Qe.__webglTexture,B),Je?D.framebufferTextureLayer(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,De.__webglTexture,et,ue+ke):D.framebufferTexture2D(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_2D,De.__webglTexture,et),B!==0?D.blitFramebuffer(Lt,Nt,dt,yt,Vt,te,dt,yt,D.COLOR_BUFFER_BIT,D.NEAREST):Je?D.copyTexSubImage3D(le,et,Vt,te,ue+ke,Lt,Nt,dt,yt):D.copyTexSubImage2D(le,et,Vt,te,Lt,Nt,dt,yt);wt.bindFramebuffer(D.READ_FRAMEBUFFER,null),wt.bindFramebuffer(D.DRAW_FRAMEBUFFER,null)}else Je?T.isDataTexture||T.isData3DTexture?D.texSubImage3D(le,et,Vt,te,ue,dt,yt,mt,ie,Ct,oe.data):z.isCompressedArrayTexture?D.compressedTexSubImage3D(le,et,Vt,te,ue,dt,yt,mt,ie,oe.data):D.texSubImage3D(le,et,Vt,te,ue,dt,yt,mt,ie,Ct,oe):T.isDataTexture?D.texSubImage2D(D.TEXTURE_2D,et,Vt,te,dt,yt,ie,Ct,oe.data):T.isCompressedTexture?D.compressedTexSubImage2D(D.TEXTURE_2D,et,Vt,te,oe.width,oe.height,ie,oe.data):D.texSubImage2D(D.TEXTURE_2D,et,Vt,te,dt,yt,ie,Ct,oe);D.pixelStorei(D.UNPACK_ROW_LENGTH,qt),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,Xe),D.pixelStorei(D.UNPACK_SKIP_PIXELS,yi),D.pixelStorei(D.UNPACK_SKIP_ROWS,qe),D.pixelStorei(D.UNPACK_SKIP_IMAGES,Qi),et===0&&z.generateMipmaps&&D.generateMipmap(le),wt.unbindTexture()},this.copyTextureToTexture3D=function(T,z,W=null,X=null,B=0){return Vi('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(T,z,W,X,B)},this.initRenderTarget=function(T){xt.get(T).__webglFramebuffer===void 0&&kt.setupRenderTarget(T)},this.initTexture=function(T){T.isCubeTexture?kt.setTextureCube(T,0):T.isData3DTexture?kt.setTexture3D(T,0):T.isDataArrayTexture||T.isCompressedArrayTexture?kt.setTexture2DArray(T,0):kt.setTexture2D(T,0),wt.unbindTexture()},this.resetState=function(){A=0,R=0,L=null,wt.reset(),ut.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return En}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=Yt._getDrawingBufferColorSpace(t),e.unpackColorSpace=Yt._getUnpackColorSpace()}}function uh(r){const t=Math.PI*2,e=((r+Math.PI)%t+t)%t-Math.PI;return Object.is(e,-0)?0:e}function da(r,t){return uh(t-r)}function Qg(r,t,e,n){const i=Math.min(Math.max(n,0),.1),s=1-Math.exp(-Math.max(e,0)*i);return uh(r+da(r,t)*s)}const t_=76,e_=4.2,Xc=7*Math.PI/180;class n_{camera;yawRad=0;targetYawRad=0;pitchRad=0;baseFovDeg=t_;yawResponsePerSecond=e_;headingErrorRad=0;reducedMotion;constructor(){this.camera=new sn(this.baseFovDeg,1,.05,140),this.camera.up.set(0,1,0),this.reducedMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches}get currentYawRad(){return this.yawRad}setTuning(t){t.baseFovDeg!==void 0&&(this.baseFovDeg=Math.min(95,Math.max(55,t.baseFovDeg))),t.yawResponsePerSecond!==void 0&&(this.yawResponsePerSecond=Math.min(10,Math.max(1.5,t.yawResponsePerSecond))),(this.reducedMotion||this.camera.fov<55||this.camera.fov>99)&&(this.camera.fov=this.baseFovDeg),this.camera.updateProjectionMatrix()}reset(t,e=0){this.yawRad=e,this.targetYawRad=e,this.pitchRad=0,this.headingErrorRad=0,this.camera.fov=this.baseFovDeg,this.syncTransform(t)}update(t,e,n){const i=Math.min(Math.max(n,0),.1),s=Math.hypot(t.velocity.x,t.velocity.z);this.targetYawRad=e,this.headingErrorRad=da(this.yawRad,this.targetYawRad),this.yawRad=Qg(this.yawRad,this.targetYawRad,this.yawResponsePerSecond,i),this.headingErrorRad=da(this.yawRad,this.targetYawRad);const o=this.reducedMotion||t.grounded?0:Math.max(-Xc,Math.min(Xc,Math.atan2(t.velocity.y,Math.max(.01,s))*.3)),a=1-Math.exp(-4.5*i);this.pitchRad+=(o-this.pitchRad)*a;const l=this.reducedMotion?this.baseFovDeg:this.baseFovDeg+Math.min(4,t.speed*.2),c=1-Math.exp(-3.5*i);this.camera.fov+=(l-this.camera.fov)*c,this.camera.updateProjectionMatrix(),this.syncTransform(t)}resize(t,e){this.camera.aspect=Math.max(.1,t/Math.max(1,e)),this.camera.updateProjectionMatrix()}telemetry(){return{yawRad:this.yawRad,targetYawRad:this.targetYawRad,headingErrorRad:this.headingErrorRad,headingState:"track-forward",pitchRad:this.pitchRad,fovDeg:this.camera.fov}}syncTransform(t){this.camera.position.set(t.position.x,t.position.y+.08,t.position.z);const e=Math.cos(this.pitchRad),n=new V(Math.sin(this.yawRad)*e,Math.sin(this.pitchRad),Math.cos(this.yawRad)*e);this.camera.lookAt(this.camera.position.clone().add(n))}}function yr(r,t,e){return Math.min(e,Math.max(t,r))}function dh(r){const t=((r+180)%360+360)%360-180;return Object.is(t,-0)?0:t}function qc(r,t){return dh(t-r)}function i_(r,t,e){const n=-dh(e)*Math.PI/180,i=Math.cos(n),s=Math.sin(n),o=t,a=r,l=o*i-a*s,c=o*s+a*i;return{x:-l,y:c}}function Yc(r,t){return{x:qc(t.x,r.x),y:qc(t.y,r.y)}}function $c(r,t,e){const n=Math.max(t+.001,e),i=Math.abs(r);if(i<=t)return 0;const s=(i-t)/(n-t);return Math.sign(r)*yr(s,0,1)}function Zc(r,t,e,n){const i=yr(n,0,.1),s=1-Math.exp(-Math.max(0,e)*i);return r+(t-r)*s}function s_(r,t=25){const e=t*Math.PI/180,n=Math.tan(yr(r.x,-1,1)*e),i=-Math.tan(yr(r.y,-1,1)*e),s=Math.hypot(n,1,i);return{x:n/s,y:-1/s,z:i/s}}function r_(){if(typeof screen<"u"&&screen.orientation&&Number.isFinite(screen.orientation.angle))return screen.orientation.angle;const r=window;return Number.isFinite(r.orientation)?Number(r.orientation):0}class Mr{kind="device";listener=null;handleOrientation=t=>{if(t.beta===null||t.gamma===null||!this.listener)return;const e=r_(),n=i_(t.beta,t.gamma,e);this.listener({source:this.kind,screenXDeg:n.x,screenYDeg:n.y,timestampMs:performance.now(),raw:{betaDeg:t.beta,gammaDeg:t.gamma,screenAngleDeg:e}})};static isSupported(){return typeof DeviceOrientationEvent<"u"}async start(t){if(!Mr.isSupported())return{status:"unavailable",reason:"This browser does not expose device orientation."};try{const e=DeviceOrientationEvent;return typeof e.requestPermission=="function"&&await e.requestPermission()!=="granted"?{status:"denied",reason:"Motion access was denied by the browser."}:(this.listener=t,window.addEventListener("deviceorientation",this.handleOrientation,{passive:!0}),{status:"started"})}catch(e){return{status:"error",reason:e instanceof Error?e.message:"Unable to start device orientation."}}}stop(){window.removeEventListener("deviceorientation",this.handleOrientation),this.listener=null}}class o_{kind="synthetic";listener=null;x=0;y=0;saturationDeg;constructor(t=25){this.saturationDeg=t}async start(t){return this.x=0,this.y=0,this.listener=t,this.emit(),{status:"started"}}setNormalized(t,e){this.x=Math.max(-1,Math.min(1,t)),this.y=Math.max(-1,Math.min(1,e)),this.emit()}stop(){this.x=0,this.y=0,this.listener=null}emit(){this.listener?.({source:this.kind,screenXDeg:this.x*this.saturationDeg,screenYDeg:this.y*this.saturationDeg,timestampMs:performance.now()})}}const a_={deadZoneDeg:1.5,saturationDeg:25,smoothingResponsePerSecond:12};function ho(r,t,e){return Math.min(e,Math.max(t,r))}class c_{config;current={x:0,y:0};neutral=null;filtered={x:0,y:0};target={x:0,y:0};lastFilterUpdateAtMs=null;source=null;raw=null;lastSampleAtMs=null;sensitivityMultiplier=1;constructor(t={}){this.config={...a_,...t}}ingest(t){this.source=t.source,this.current={x:t.screenXDeg,y:t.screenYDeg},this.raw=t.raw??null,this.lastSampleAtMs=t.timestampMs,this.refreshTarget()}setResponseTuning(t){const e=ho(t.deadZoneDeg??this.config.deadZoneDeg,.25,4),n=ho(t.saturationDeg??this.config.saturationDeg,15,35),i=ho(t.smoothingResponsePerSecond??this.config.smoothingResponsePerSecond,4,24);this.config={deadZoneDeg:e,saturationDeg:Math.max(e+1,n),smoothingResponsePerSecond:i},this.refreshTarget()}setSensitivityMultiplier(t){this.sensitivityMultiplier=Math.min(2,Math.max(.5,t)),this.refreshTarget()}update(t){if(!this.neutral)return;const e=this.lastFilterUpdateAtMs===null?1/60:Math.max(0,(t-this.lastFilterUpdateAtMs)/1e3);this.lastFilterUpdateAtMs=t,this.filtered={x:Zc(this.filtered.x,this.target.x,this.config.smoothingResponsePerSecond,e),y:Zc(this.filtered.y,this.target.y,this.config.smoothingResponsePerSecond,e)}}recenter(){return this.lastSampleAtMs===null?!1:(this.neutral={...this.current},this.target={x:0,y:0},this.filtered={x:0,y:0},this.lastFilterUpdateAtMs=null,!0)}clearCalibration(){this.neutral=null,this.target={x:0,y:0},this.filtered={x:0,y:0},this.lastFilterUpdateAtMs=null}snapshot(){const t=this.neutral?Yc(this.current,this.neutral):{x:0,y:0};return{source:this.source,hasSample:this.lastSampleAtMs!==null,neutral:this.neutral?{...this.neutral}:null,screenTiltDeg:{...this.current},relativeTiltDeg:t,normalized:{...this.filtered},gravityDirection:s_(this.filtered,this.config.saturationDeg),raw:this.raw?{...this.raw}:null,lastSampleAtMs:this.lastSampleAtMs}}refreshTarget(){if(!this.neutral)return;const t=Yc(this.current,this.neutral),e=Math.max(this.config.deadZoneDeg+.001,this.config.saturationDeg/this.sensitivityMultiplier);this.target={x:$c(t.x,this.config.deadZoneDeg,e),y:$c(t.y,this.config.deadZoneDeg,e)}}}function l_(r,t){const e=Math.cos(t),n=Math.sin(t);return{x:r.x*e+r.z*n,y:r.y,z:-r.x*n+r.z*e}}const h_={acceleration:18,captureDistance:1.15,footprintPadding:.6},u_={active:!1,pieceId:null,strength:0,acceleration:{x:0,y:0,z:0},inwardNormal:null};function fh(r,t){const e=Math.cos(t),n=Math.sin(t);return{x:r.x,y:r.y*e-r.z*n,z:r.y*n+r.z*e}}function ph(r,t){const e=Math.cos(t),n=Math.sin(t);return{x:r.x*e+r.z*n,y:r.y,z:-r.x*n+r.z*e}}function mh(r,t){const e=Math.cos(t),n=Math.sin(t);return{x:r.x*e-r.y*n,y:r.x*n+r.y*e,z:r.z}}function d_(r,t){return mh(ph(fh(r,t.x),t.y),t.z)}function f_(r,t){return fh(ph(mh(r,-t.z),-t.y),-t.x)}function gh(r){const t=Math.hypot(r.x,r.y,r.z);return t<=1e-9?{x:0,y:-1,z:0}:{x:r.x/t,y:r.y/t,z:r.z/t}}function p_(r){const t=Math.min(1,Math.max(0,r));return 1-t*t*(3-2*t)}function m_(r,t,e){const n=Math.cos(t),i=Math.sin(t),s=r.x*n+r.z*i,o=-r.x*i+r.z*n,a=Math.max(0,-r.y);return gh({x:s+e.x*a,y:e.y*a,z:o+e.z*a})}function g_(r,t,e,n=h_){let i=u_;for(const s of e){if(s.surface!=="magnetic")continue;const o=f_({x:r.x-s.position.x,y:r.y-s.position.y,z:r.z-s.position.z},s.rotation),a=s.size.x/2,l=s.size.y/2,c=s.size.z/2,h=n.footprintPadding+t*.35;if(Math.abs(o.x)>a+h||Math.abs(o.z)>c+h)continue;const d=Math.max(0,Math.abs(o.y)-l-t);if(d>n.captureDistance)continue;const u=p_(d/Math.max(.001,n.captureDistance));if(u<=i.strength)continue;const p=o.y>=0?1:-1,g=gh(d_({x:0,y:p,z:0},s.rotation)),_={x:-g.x,y:-g.y,z:-g.z},m=n.acceleration*u;i={active:!0,pieceId:s.id,strength:u,acceleration:{x:_.x*m,y:_.y*m,z:_.z*m},inwardNormal:_}}return i}class dn{constructor(t){t===void 0&&(t=[0,0,0,0,0,0,0,0,0]),this.elements=t}identity(){const t=this.elements;t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=1,t[5]=0,t[6]=0,t[7]=0,t[8]=1}setZero(){const t=this.elements;t[0]=0,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=0,t[6]=0,t[7]=0,t[8]=0}setTrace(t){const e=this.elements;e[0]=t.x,e[4]=t.y,e[8]=t.z}getTrace(t){t===void 0&&(t=new M);const e=this.elements;return t.x=e[0],t.y=e[4],t.z=e[8],t}vmult(t,e){e===void 0&&(e=new M);const n=this.elements,i=t.x,s=t.y,o=t.z;return e.x=n[0]*i+n[1]*s+n[2]*o,e.y=n[3]*i+n[4]*s+n[5]*o,e.z=n[6]*i+n[7]*s+n[8]*o,e}smult(t){for(let e=0;e<this.elements.length;e++)this.elements[e]*=t}mmult(t,e){e===void 0&&(e=new dn);const n=this.elements,i=t.elements,s=e.elements,o=n[0],a=n[1],l=n[2],c=n[3],h=n[4],d=n[5],u=n[6],p=n[7],g=n[8],_=i[0],m=i[1],f=i[2],v=i[3],S=i[4],x=i[5],w=i[6],A=i[7],R=i[8];return s[0]=o*_+a*v+l*w,s[1]=o*m+a*S+l*A,s[2]=o*f+a*x+l*R,s[3]=c*_+h*v+d*w,s[4]=c*m+h*S+d*A,s[5]=c*f+h*x+d*R,s[6]=u*_+p*v+g*w,s[7]=u*m+p*S+g*A,s[8]=u*f+p*x+g*R,e}scale(t,e){e===void 0&&(e=new dn);const n=this.elements,i=e.elements;for(let s=0;s!==3;s++)i[3*s+0]=t.x*n[3*s+0],i[3*s+1]=t.y*n[3*s+1],i[3*s+2]=t.z*n[3*s+2];return e}solve(t,e){e===void 0&&(e=new M);const n=3,i=4,s=[];let o,a;for(o=0;o<n*i;o++)s.push(0);for(o=0;o<3;o++)for(a=0;a<3;a++)s[o+i*a]=this.elements[o+3*a];s[3]=t.x,s[7]=t.y,s[11]=t.z;let l=3;const c=l;let h;const d=4;let u;do{if(o=c-l,s[o+i*o]===0){for(a=o+1;a<c;a++)if(s[o+i*a]!==0){h=d;do u=d-h,s[u+i*o]+=s[u+i*a];while(--h);break}}if(s[o+i*o]!==0)for(a=o+1;a<c;a++){const p=s[o+i*a]/s[o+i*o];h=d;do u=d-h,s[u+i*a]=u<=o?0:s[u+i*a]-s[u+i*o]*p;while(--h)}}while(--l);if(e.z=s[2*i+3]/s[2*i+2],e.y=(s[1*i+3]-s[1*i+2]*e.z)/s[1*i+1],e.x=(s[0*i+3]-s[0*i+2]*e.z-s[0*i+1]*e.y)/s[0*i+0],isNaN(e.x)||isNaN(e.y)||isNaN(e.z)||e.x===1/0||e.y===1/0||e.z===1/0)throw`Could not solve equation! Got x=[${e.toString()}], b=[${t.toString()}], A=[${this.toString()}]`;return e}e(t,e,n){if(n===void 0)return this.elements[e+3*t];this.elements[e+3*t]=n}copy(t){for(let e=0;e<t.elements.length;e++)this.elements[e]=t.elements[e];return this}toString(){let t="";for(let n=0;n<9;n++)t+=this.elements[n]+",";return t}reverse(t){t===void 0&&(t=new dn);const e=3,n=6,i=__;let s,o;for(s=0;s<3;s++)for(o=0;o<3;o++)i[s+n*o]=this.elements[s+3*o];i[3]=1,i[9]=0,i[15]=0,i[4]=0,i[10]=1,i[16]=0,i[5]=0,i[11]=0,i[17]=1;let a=3;const l=a;let c;const h=n;let d;do{if(s=l-a,i[s+n*s]===0){for(o=s+1;o<l;o++)if(i[s+n*o]!==0){c=h;do d=h-c,i[d+n*s]+=i[d+n*o];while(--c);break}}if(i[s+n*s]!==0)for(o=s+1;o<l;o++){const u=i[s+n*o]/i[s+n*s];c=h;do d=h-c,i[d+n*o]=d<=s?0:i[d+n*o]-i[d+n*s]*u;while(--c)}}while(--a);s=2;do{o=s-1;do{const u=i[s+n*o]/i[s+n*s];c=n;do d=n-c,i[d+n*o]=i[d+n*o]-i[d+n*s]*u;while(--c)}while(o--)}while(--s);s=2;do{const u=1/i[s+n*s];c=n;do d=n-c,i[d+n*s]=i[d+n*s]*u;while(--c)}while(s--);s=2;do{o=2;do{if(d=i[e+o+n*s],isNaN(d)||d===1/0)throw`Could not reverse! A=[${this.toString()}]`;t.e(s,o,d)}while(o--)}while(s--);return t}setRotationFromQuaternion(t){const e=t.x,n=t.y,i=t.z,s=t.w,o=e+e,a=n+n,l=i+i,c=e*o,h=e*a,d=e*l,u=n*a,p=n*l,g=i*l,_=s*o,m=s*a,f=s*l,v=this.elements;return v[0]=1-(u+g),v[1]=h-f,v[2]=d+m,v[3]=h+f,v[4]=1-(c+g),v[5]=p-_,v[6]=d-m,v[7]=p+_,v[8]=1-(c+u),this}transpose(t){t===void 0&&(t=new dn);const e=this.elements,n=t.elements;let i;return n[0]=e[0],n[4]=e[4],n[8]=e[8],i=e[1],n[1]=e[3],n[3]=i,i=e[2],n[2]=e[6],n[6]=i,i=e[5],n[5]=e[7],n[7]=i,t}}const __=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];class M{constructor(t,e,n){t===void 0&&(t=0),e===void 0&&(e=0),n===void 0&&(n=0),this.x=t,this.y=e,this.z=n}cross(t,e){e===void 0&&(e=new M);const n=t.x,i=t.y,s=t.z,o=this.x,a=this.y,l=this.z;return e.x=a*s-l*i,e.y=l*n-o*s,e.z=o*i-a*n,e}set(t,e,n){return this.x=t,this.y=e,this.z=n,this}setZero(){this.x=this.y=this.z=0}vadd(t,e){if(e)e.x=t.x+this.x,e.y=t.y+this.y,e.z=t.z+this.z;else return new M(this.x+t.x,this.y+t.y,this.z+t.z)}vsub(t,e){if(e)e.x=this.x-t.x,e.y=this.y-t.y,e.z=this.z-t.z;else return new M(this.x-t.x,this.y-t.y,this.z-t.z)}crossmat(){return new dn([0,-this.z,this.y,this.z,0,-this.x,-this.y,this.x,0])}normalize(){const t=this.x,e=this.y,n=this.z,i=Math.sqrt(t*t+e*e+n*n);if(i>0){const s=1/i;this.x*=s,this.y*=s,this.z*=s}else this.x=0,this.y=0,this.z=0;return i}unit(t){t===void 0&&(t=new M);const e=this.x,n=this.y,i=this.z;let s=Math.sqrt(e*e+n*n+i*i);return s>0?(s=1/s,t.x=e*s,t.y=n*s,t.z=i*s):(t.x=1,t.y=0,t.z=0),t}length(){const t=this.x,e=this.y,n=this.z;return Math.sqrt(t*t+e*e+n*n)}lengthSquared(){return this.dot(this)}distanceTo(t){const e=this.x,n=this.y,i=this.z,s=t.x,o=t.y,a=t.z;return Math.sqrt((s-e)*(s-e)+(o-n)*(o-n)+(a-i)*(a-i))}distanceSquared(t){const e=this.x,n=this.y,i=this.z,s=t.x,o=t.y,a=t.z;return(s-e)*(s-e)+(o-n)*(o-n)+(a-i)*(a-i)}scale(t,e){e===void 0&&(e=new M);const n=this.x,i=this.y,s=this.z;return e.x=t*n,e.y=t*i,e.z=t*s,e}vmul(t,e){return e===void 0&&(e=new M),e.x=t.x*this.x,e.y=t.y*this.y,e.z=t.z*this.z,e}addScaledVector(t,e,n){return n===void 0&&(n=new M),n.x=this.x+t*e.x,n.y=this.y+t*e.y,n.z=this.z+t*e.z,n}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}isZero(){return this.x===0&&this.y===0&&this.z===0}negate(t){return t===void 0&&(t=new M),t.x=-this.x,t.y=-this.y,t.z=-this.z,t}tangents(t,e){const n=this.length();if(n>0){const i=v_,s=1/n;i.set(this.x*s,this.y*s,this.z*s);const o=x_;Math.abs(i.x)<.9?(o.set(1,0,0),i.cross(o,t)):(o.set(0,1,0),i.cross(o,t)),i.cross(t,e)}else t.set(1,0,0),e.set(0,1,0)}toString(){return`${this.x},${this.y},${this.z}`}toArray(){return[this.x,this.y,this.z]}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}lerp(t,e,n){const i=this.x,s=this.y,o=this.z;n.x=i+(t.x-i)*e,n.y=s+(t.y-s)*e,n.z=o+(t.z-o)*e}almostEquals(t,e){return e===void 0&&(e=1e-6),!(Math.abs(this.x-t.x)>e||Math.abs(this.y-t.y)>e||Math.abs(this.z-t.z)>e)}almostZero(t){return t===void 0&&(t=1e-6),!(Math.abs(this.x)>t||Math.abs(this.y)>t||Math.abs(this.z)>t)}isAntiparallelTo(t,e){return this.negate(jc),jc.almostEquals(t,e)}clone(){return new M(this.x,this.y,this.z)}}M.ZERO=new M(0,0,0);M.UNIT_X=new M(1,0,0);M.UNIT_Y=new M(0,1,0);M.UNIT_Z=new M(0,0,1);const v_=new M,x_=new M,jc=new M;class Ke{constructor(t){t===void 0&&(t={}),this.lowerBound=new M,this.upperBound=new M,t.lowerBound&&this.lowerBound.copy(t.lowerBound),t.upperBound&&this.upperBound.copy(t.upperBound)}setFromPoints(t,e,n,i){const s=this.lowerBound,o=this.upperBound,a=n;s.copy(t[0]),a&&a.vmult(s,s),o.copy(s);for(let l=1;l<t.length;l++){let c=t[l];a&&(a.vmult(c,Kc),c=Kc),c.x>o.x&&(o.x=c.x),c.x<s.x&&(s.x=c.x),c.y>o.y&&(o.y=c.y),c.y<s.y&&(s.y=c.y),c.z>o.z&&(o.z=c.z),c.z<s.z&&(s.z=c.z)}return e&&(e.vadd(s,s),e.vadd(o,o)),i&&(s.x-=i,s.y-=i,s.z-=i,o.x+=i,o.y+=i,o.z+=i),this}copy(t){return this.lowerBound.copy(t.lowerBound),this.upperBound.copy(t.upperBound),this}clone(){return new Ke().copy(this)}extend(t){this.lowerBound.x=Math.min(this.lowerBound.x,t.lowerBound.x),this.upperBound.x=Math.max(this.upperBound.x,t.upperBound.x),this.lowerBound.y=Math.min(this.lowerBound.y,t.lowerBound.y),this.upperBound.y=Math.max(this.upperBound.y,t.upperBound.y),this.lowerBound.z=Math.min(this.lowerBound.z,t.lowerBound.z),this.upperBound.z=Math.max(this.upperBound.z,t.upperBound.z)}overlaps(t){const e=this.lowerBound,n=this.upperBound,i=t.lowerBound,s=t.upperBound,o=i.x<=n.x&&n.x<=s.x||e.x<=s.x&&s.x<=n.x,a=i.y<=n.y&&n.y<=s.y||e.y<=s.y&&s.y<=n.y,l=i.z<=n.z&&n.z<=s.z||e.z<=s.z&&s.z<=n.z;return o&&a&&l}volume(){const t=this.lowerBound,e=this.upperBound;return(e.x-t.x)*(e.y-t.y)*(e.z-t.z)}contains(t){const e=this.lowerBound,n=this.upperBound,i=t.lowerBound,s=t.upperBound;return e.x<=i.x&&n.x>=s.x&&e.y<=i.y&&n.y>=s.y&&e.z<=i.z&&n.z>=s.z}getCorners(t,e,n,i,s,o,a,l){const c=this.lowerBound,h=this.upperBound;t.copy(c),e.set(h.x,c.y,c.z),n.set(h.x,h.y,c.z),i.set(c.x,h.y,h.z),s.set(h.x,c.y,h.z),o.set(c.x,h.y,c.z),a.set(c.x,c.y,h.z),l.copy(h)}toLocalFrame(t,e){const n=Jc,i=n[0],s=n[1],o=n[2],a=n[3],l=n[4],c=n[5],h=n[6],d=n[7];this.getCorners(i,s,o,a,l,c,h,d);for(let u=0;u!==8;u++){const p=n[u];t.pointToLocal(p,p)}return e.setFromPoints(n)}toWorldFrame(t,e){const n=Jc,i=n[0],s=n[1],o=n[2],a=n[3],l=n[4],c=n[5],h=n[6],d=n[7];this.getCorners(i,s,o,a,l,c,h,d);for(let u=0;u!==8;u++){const p=n[u];t.pointToWorld(p,p)}return e.setFromPoints(n)}overlapsRay(t){const{direction:e,from:n}=t,i=1/e.x,s=1/e.y,o=1/e.z,a=(this.lowerBound.x-n.x)*i,l=(this.upperBound.x-n.x)*i,c=(this.lowerBound.y-n.y)*s,h=(this.upperBound.y-n.y)*s,d=(this.lowerBound.z-n.z)*o,u=(this.upperBound.z-n.z)*o,p=Math.max(Math.max(Math.min(a,l),Math.min(c,h)),Math.min(d,u)),g=Math.min(Math.min(Math.max(a,l),Math.max(c,h)),Math.max(d,u));return!(g<0||p>g)}}const Kc=new M,Jc=[new M,new M,new M,new M,new M,new M,new M,new M];class Qc{constructor(){this.matrix=[]}get(t,e){let{index:n}=t,{index:i}=e;if(i>n){const s=i;i=n,n=s}return this.matrix[(n*(n+1)>>1)+i-1]}set(t,e,n){let{index:i}=t,{index:s}=e;if(s>i){const o=s;s=i,i=o}this.matrix[(i*(i+1)>>1)+s-1]=n?1:0}reset(){for(let t=0,e=this.matrix.length;t!==e;t++)this.matrix[t]=0}setNumObjects(t){this.matrix.length=t*(t-1)>>1}}class _h{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;return n[t]===void 0&&(n[t]=[]),n[t].includes(e)||n[t].push(e),this}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return!!(n[t]!==void 0&&n[t].includes(e))}hasAnyEventListener(t){return this._listeners===void 0?!1:this._listeners[t]!==void 0}removeEventListener(t,e){if(this._listeners===void 0)return this;const n=this._listeners;if(n[t]===void 0)return this;const i=n[t].indexOf(e);return i!==-1&&n[t].splice(i,1),this}dispatchEvent(t){if(this._listeners===void 0)return this;const n=this._listeners[t.type];if(n!==void 0){t.target=this;for(let i=0,s=n.length;i<s;i++)n[i].call(this,t)}return this}}class ve{constructor(t,e,n,i){t===void 0&&(t=0),e===void 0&&(e=0),n===void 0&&(n=0),i===void 0&&(i=1),this.x=t,this.y=e,this.z=n,this.w=i}set(t,e,n,i){return this.x=t,this.y=e,this.z=n,this.w=i,this}toString(){return`${this.x},${this.y},${this.z},${this.w}`}toArray(){return[this.x,this.y,this.z,this.w]}setFromAxisAngle(t,e){const n=Math.sin(e*.5);return this.x=t.x*n,this.y=t.y*n,this.z=t.z*n,this.w=Math.cos(e*.5),this}toAxisAngle(t){t===void 0&&(t=new M),this.normalize();const e=2*Math.acos(this.w),n=Math.sqrt(1-this.w*this.w);return n<.001?(t.x=this.x,t.y=this.y,t.z=this.z):(t.x=this.x/n,t.y=this.y/n,t.z=this.z/n),[t,e]}setFromVectors(t,e){if(t.isAntiparallelTo(e)){const n=y_,i=M_;t.tangents(n,i),this.setFromAxisAngle(n,Math.PI)}else{const n=t.cross(e);this.x=n.x,this.y=n.y,this.z=n.z,this.w=Math.sqrt(t.length()**2*e.length()**2)+t.dot(e),this.normalize()}return this}mult(t,e){e===void 0&&(e=new ve);const n=this.x,i=this.y,s=this.z,o=this.w,a=t.x,l=t.y,c=t.z,h=t.w;return e.x=n*h+o*a+i*c-s*l,e.y=i*h+o*l+s*a-n*c,e.z=s*h+o*c+n*l-i*a,e.w=o*h-n*a-i*l-s*c,e}inverse(t){t===void 0&&(t=new ve);const e=this.x,n=this.y,i=this.z,s=this.w;this.conjugate(t);const o=1/(e*e+n*n+i*i+s*s);return t.x*=o,t.y*=o,t.z*=o,t.w*=o,t}conjugate(t){return t===void 0&&(t=new ve),t.x=-this.x,t.y=-this.y,t.z=-this.z,t.w=this.w,t}normalize(){let t=Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w);return t===0?(this.x=0,this.y=0,this.z=0,this.w=0):(t=1/t,this.x*=t,this.y*=t,this.z*=t,this.w*=t),this}normalizeFast(){const t=(3-(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w))/2;return t===0?(this.x=0,this.y=0,this.z=0,this.w=0):(this.x*=t,this.y*=t,this.z*=t,this.w*=t),this}vmult(t,e){e===void 0&&(e=new M);const n=t.x,i=t.y,s=t.z,o=this.x,a=this.y,l=this.z,c=this.w,h=c*n+a*s-l*i,d=c*i+l*n-o*s,u=c*s+o*i-a*n,p=-o*n-a*i-l*s;return e.x=h*c+p*-o+d*-l-u*-a,e.y=d*c+p*-a+u*-o-h*-l,e.z=u*c+p*-l+h*-a-d*-o,e}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w,this}toEuler(t,e){e===void 0&&(e="YZX");let n,i,s;const o=this.x,a=this.y,l=this.z,c=this.w;switch(e){case"YZX":const h=o*a+l*c;if(h>.499&&(n=2*Math.atan2(o,c),i=Math.PI/2,s=0),h<-.499&&(n=-2*Math.atan2(o,c),i=-Math.PI/2,s=0),n===void 0){const d=o*o,u=a*a,p=l*l;n=Math.atan2(2*a*c-2*o*l,1-2*u-2*p),i=Math.asin(2*h),s=Math.atan2(2*o*c-2*a*l,1-2*d-2*p)}break;default:throw new Error(`Euler order ${e} not supported yet.`)}t.y=n,t.z=i,t.x=s}setFromEuler(t,e,n,i){i===void 0&&(i="XYZ");const s=Math.cos(t/2),o=Math.cos(e/2),a=Math.cos(n/2),l=Math.sin(t/2),c=Math.sin(e/2),h=Math.sin(n/2);return i==="XYZ"?(this.x=l*o*a+s*c*h,this.y=s*c*a-l*o*h,this.z=s*o*h+l*c*a,this.w=s*o*a-l*c*h):i==="YXZ"?(this.x=l*o*a+s*c*h,this.y=s*c*a-l*o*h,this.z=s*o*h-l*c*a,this.w=s*o*a+l*c*h):i==="ZXY"?(this.x=l*o*a-s*c*h,this.y=s*c*a+l*o*h,this.z=s*o*h+l*c*a,this.w=s*o*a-l*c*h):i==="ZYX"?(this.x=l*o*a-s*c*h,this.y=s*c*a+l*o*h,this.z=s*o*h-l*c*a,this.w=s*o*a+l*c*h):i==="YZX"?(this.x=l*o*a+s*c*h,this.y=s*c*a+l*o*h,this.z=s*o*h-l*c*a,this.w=s*o*a-l*c*h):i==="XZY"&&(this.x=l*o*a-s*c*h,this.y=s*c*a-l*o*h,this.z=s*o*h+l*c*a,this.w=s*o*a+l*c*h),this}clone(){return new ve(this.x,this.y,this.z,this.w)}slerp(t,e,n){n===void 0&&(n=new ve);const i=this.x,s=this.y,o=this.z,a=this.w;let l=t.x,c=t.y,h=t.z,d=t.w,u,p,g,_,m;return p=i*l+s*c+o*h+a*d,p<0&&(p=-p,l=-l,c=-c,h=-h,d=-d),1-p>1e-6?(u=Math.acos(p),g=Math.sin(u),_=Math.sin((1-e)*u)/g,m=Math.sin(e*u)/g):(_=1-e,m=e),n.x=_*i+m*l,n.y=_*s+m*c,n.z=_*o+m*h,n.w=_*a+m*d,n}integrate(t,e,n,i){i===void 0&&(i=new ve);const s=t.x*n.x,o=t.y*n.y,a=t.z*n.z,l=this.x,c=this.y,h=this.z,d=this.w,u=e*.5;return i.x+=u*(s*d+o*h-a*c),i.y+=u*(o*d+a*l-s*h),i.z+=u*(a*d+s*c-o*l),i.w+=u*(-s*l-o*c-a*h),i}}const y_=new M,M_=new M,S_={SPHERE:1,PLANE:2,BOX:4,COMPOUND:8,CONVEXPOLYHEDRON:16,HEIGHTFIELD:32,PARTICLE:64,CYLINDER:128,TRIMESH:256};class _t{constructor(t){t===void 0&&(t={}),this.id=_t.idCounter++,this.type=t.type||0,this.boundingSphereRadius=0,this.collisionResponse=t.collisionResponse?t.collisionResponse:!0,this.collisionFilterGroup=t.collisionFilterGroup!==void 0?t.collisionFilterGroup:1,this.collisionFilterMask=t.collisionFilterMask!==void 0?t.collisionFilterMask:-1,this.material=t.material?t.material:null,this.body=null}updateBoundingSphereRadius(){throw`computeBoundingSphereRadius() not implemented for shape type ${this.type}`}volume(){throw`volume() not implemented for shape type ${this.type}`}calculateLocalInertia(t,e){throw`calculateLocalInertia() not implemented for shape type ${this.type}`}calculateWorldAABB(t,e,n,i){throw`calculateWorldAABB() not implemented for shape type ${this.type}`}}_t.idCounter=0;_t.types=S_;class jt{constructor(t){t===void 0&&(t={}),this.position=new M,this.quaternion=new ve,t.position&&this.position.copy(t.position),t.quaternion&&this.quaternion.copy(t.quaternion)}pointToLocal(t,e){return jt.pointToLocalFrame(this.position,this.quaternion,t,e)}pointToWorld(t,e){return jt.pointToWorldFrame(this.position,this.quaternion,t,e)}vectorToWorldFrame(t,e){return e===void 0&&(e=new M),this.quaternion.vmult(t,e),e}static pointToLocalFrame(t,e,n,i){return i===void 0&&(i=new M),n.vsub(t,i),e.conjugate(tl),tl.vmult(i,i),i}static pointToWorldFrame(t,e,n,i){return i===void 0&&(i=new M),e.vmult(n,i),i.vadd(t,i),i}static vectorToWorldFrame(t,e,n){return n===void 0&&(n=new M),t.vmult(e,n),n}static vectorToLocalFrame(t,e,n,i){return i===void 0&&(i=new M),e.w*=-1,e.vmult(n,i),e.w*=-1,i}}const tl=new ve;class fs extends _t{constructor(t){t===void 0&&(t={});const{vertices:e=[],faces:n=[],normals:i=[],axes:s,boundingSphereRadius:o}=t;super({type:_t.types.CONVEXPOLYHEDRON}),this.vertices=e,this.faces=n,this.faceNormals=i,this.faceNormals.length===0&&this.computeNormals(),o?this.boundingSphereRadius=o:this.updateBoundingSphereRadius(),this.worldVertices=[],this.worldVerticesNeedsUpdate=!0,this.worldFaceNormals=[],this.worldFaceNormalsNeedsUpdate=!0,this.uniqueAxes=s?s.slice():null,this.uniqueEdges=[],this.computeEdges()}computeEdges(){const t=this.faces,e=this.vertices,n=this.uniqueEdges;n.length=0;const i=new M;for(let s=0;s!==t.length;s++){const o=t[s],a=o.length;for(let l=0;l!==a;l++){const c=(l+1)%a;e[o[l]].vsub(e[o[c]],i),i.normalize();let h=!1;for(let d=0;d!==n.length;d++)if(n[d].almostEquals(i)||n[d].almostEquals(i)){h=!0;break}h||n.push(i.clone())}}}computeNormals(){this.faceNormals.length=this.faces.length;for(let t=0;t<this.faces.length;t++){for(let i=0;i<this.faces[t].length;i++)if(!this.vertices[this.faces[t][i]])throw new Error(`Vertex ${this.faces[t][i]} not found!`);const e=this.faceNormals[t]||new M;this.getFaceNormal(t,e),e.negate(e),this.faceNormals[t]=e;const n=this.vertices[this.faces[t][0]];if(e.dot(n)<0){console.error(`.faceNormals[${t}] = Vec3(${e.toString()}) looks like it points into the shape? The vertices follow. Make sure they are ordered CCW around the normal, using the right hand rule.`);for(let i=0;i<this.faces[t].length;i++)console.warn(`.vertices[${this.faces[t][i]}] = Vec3(${this.vertices[this.faces[t][i]].toString()})`)}}}getFaceNormal(t,e){const n=this.faces[t],i=this.vertices[n[0]],s=this.vertices[n[1]],o=this.vertices[n[2]];fs.computeNormal(i,s,o,e)}static computeNormal(t,e,n,i){const s=new M,o=new M;e.vsub(t,o),n.vsub(e,s),s.cross(o,i),i.isZero()||i.normalize()}clipAgainstHull(t,e,n,i,s,o,a,l,c){const h=new M;let d=-1,u=-Number.MAX_VALUE;for(let g=0;g<n.faces.length;g++){h.copy(n.faceNormals[g]),s.vmult(h,h);const _=h.dot(o);_>u&&(u=_,d=g)}const p=[];for(let g=0;g<n.faces[d].length;g++){const _=n.vertices[n.faces[d][g]],m=new M;m.copy(_),s.vmult(m,m),i.vadd(m,m),p.push(m)}d>=0&&this.clipFaceAgainstHull(o,t,e,p,a,l,c)}findSeparatingAxis(t,e,n,i,s,o,a,l){const c=new M,h=new M,d=new M,u=new M,p=new M,g=new M;let _=Number.MAX_VALUE;const m=this;if(m.uniqueAxes)for(let f=0;f!==m.uniqueAxes.length;f++){n.vmult(m.uniqueAxes[f],c);const v=m.testSepAxis(c,t,e,n,i,s);if(v===!1)return!1;v<_&&(_=v,o.copy(c))}else{const f=a?a.length:m.faces.length;for(let v=0;v<f;v++){const S=a?a[v]:v;c.copy(m.faceNormals[S]),n.vmult(c,c);const x=m.testSepAxis(c,t,e,n,i,s);if(x===!1)return!1;x<_&&(_=x,o.copy(c))}}if(t.uniqueAxes)for(let f=0;f!==t.uniqueAxes.length;f++){s.vmult(t.uniqueAxes[f],h);const v=m.testSepAxis(h,t,e,n,i,s);if(v===!1)return!1;v<_&&(_=v,o.copy(h))}else{const f=l?l.length:t.faces.length;for(let v=0;v<f;v++){const S=l?l[v]:v;h.copy(t.faceNormals[S]),s.vmult(h,h);const x=m.testSepAxis(h,t,e,n,i,s);if(x===!1)return!1;x<_&&(_=x,o.copy(h))}}for(let f=0;f!==m.uniqueEdges.length;f++){n.vmult(m.uniqueEdges[f],u);for(let v=0;v!==t.uniqueEdges.length;v++)if(s.vmult(t.uniqueEdges[v],p),u.cross(p,g),!g.almostZero()){g.normalize();const S=m.testSepAxis(g,t,e,n,i,s);if(S===!1)return!1;S<_&&(_=S,o.copy(g))}}return i.vsub(e,d),d.dot(o)>0&&o.negate(o),!0}testSepAxis(t,e,n,i,s,o){const a=this;fs.project(a,t,n,i,uo),fs.project(e,t,s,o,fo);const l=uo[0],c=uo[1],h=fo[0],d=fo[1];if(l<d||h<c)return!1;const u=l-d,p=h-c;return u<p?u:p}calculateLocalInertia(t,e){const n=new M,i=new M;this.computeLocalAABB(i,n);const s=n.x-i.x,o=n.y-i.y,a=n.z-i.z;e.x=1/12*t*(2*o*2*o+2*a*2*a),e.y=1/12*t*(2*s*2*s+2*a*2*a),e.z=1/12*t*(2*o*2*o+2*s*2*s)}getPlaneConstantOfFace(t){const e=this.faces[t],n=this.faceNormals[t],i=this.vertices[e[0]];return-n.dot(i)}clipFaceAgainstHull(t,e,n,i,s,o,a){const l=new M,c=new M,h=new M,d=new M,u=new M,p=new M,g=new M,_=new M,m=this,f=[],v=i,S=f;let x=-1,w=Number.MAX_VALUE;for(let E=0;E<m.faces.length;E++){l.copy(m.faceNormals[E]),n.vmult(l,l);const P=l.dot(t);P<w&&(w=P,x=E)}if(x<0)return;const A=m.faces[x];A.connectedFaces=[];for(let E=0;E<m.faces.length;E++)for(let P=0;P<m.faces[E].length;P++)A.indexOf(m.faces[E][P])!==-1&&E!==x&&A.connectedFaces.indexOf(E)===-1&&A.connectedFaces.push(E);const R=A.length;for(let E=0;E<R;E++){const P=m.vertices[A[E]],H=m.vertices[A[(E+1)%R]];P.vsub(H,c),h.copy(c),n.vmult(h,h),e.vadd(h,h),d.copy(this.faceNormals[x]),n.vmult(d,d),e.vadd(d,d),h.cross(d,u),u.negate(u),p.copy(P),n.vmult(p,p),e.vadd(p,p);const I=A.connectedFaces[E];g.copy(this.faceNormals[I]);const F=this.getPlaneConstantOfFace(I);_.copy(g),n.vmult(_,_);const O=F-_.dot(e);for(this.clipFaceAgainstPlane(v,S,_,O);v.length;)v.shift();for(;S.length;)v.push(S.shift())}g.copy(this.faceNormals[x]);const L=this.getPlaneConstantOfFace(x);_.copy(g),n.vmult(_,_);const b=L-_.dot(e);for(let E=0;E<v.length;E++){let P=_.dot(v[E])+b;if(P<=s&&(console.log(`clamped: depth=${P} to minDist=${s}`),P=s),P<=o){const H=v[E];if(P<=1e-6){const I={point:H,normal:_,depth:P};a.push(I)}}}}clipFaceAgainstPlane(t,e,n,i){let s,o;const a=t.length;if(a<2)return e;let l=t[t.length-1],c=t[0];s=n.dot(l)+i;for(let h=0;h<a;h++){if(c=t[h],o=n.dot(c)+i,s<0)if(o<0){const d=new M;d.copy(c),e.push(d)}else{const d=new M;l.lerp(c,s/(s-o),d),e.push(d)}else if(o<0){const d=new M;l.lerp(c,s/(s-o),d),e.push(d),e.push(c)}l=c,s=o}return e}computeWorldVertices(t,e){for(;this.worldVertices.length<this.vertices.length;)this.worldVertices.push(new M);const n=this.vertices,i=this.worldVertices;for(let s=0;s!==this.vertices.length;s++)e.vmult(n[s],i[s]),t.vadd(i[s],i[s]);this.worldVerticesNeedsUpdate=!1}computeLocalAABB(t,e){const n=this.vertices;t.set(Number.MAX_VALUE,Number.MAX_VALUE,Number.MAX_VALUE),e.set(-Number.MAX_VALUE,-Number.MAX_VALUE,-Number.MAX_VALUE);for(let i=0;i<this.vertices.length;i++){const s=n[i];s.x<t.x?t.x=s.x:s.x>e.x&&(e.x=s.x),s.y<t.y?t.y=s.y:s.y>e.y&&(e.y=s.y),s.z<t.z?t.z=s.z:s.z>e.z&&(e.z=s.z)}}computeWorldFaceNormals(t){const e=this.faceNormals.length;for(;this.worldFaceNormals.length<e;)this.worldFaceNormals.push(new M);const n=this.faceNormals,i=this.worldFaceNormals;for(let s=0;s!==e;s++)t.vmult(n[s],i[s]);this.worldFaceNormalsNeedsUpdate=!1}updateBoundingSphereRadius(){let t=0;const e=this.vertices;for(let n=0;n!==e.length;n++){const i=e[n].lengthSquared();i>t&&(t=i)}this.boundingSphereRadius=Math.sqrt(t)}calculateWorldAABB(t,e,n,i){const s=this.vertices;let o,a,l,c,h,d,u=new M;for(let p=0;p<s.length;p++){u.copy(s[p]),e.vmult(u,u),t.vadd(u,u);const g=u;(o===void 0||g.x<o)&&(o=g.x),(c===void 0||g.x>c)&&(c=g.x),(a===void 0||g.y<a)&&(a=g.y),(h===void 0||g.y>h)&&(h=g.y),(l===void 0||g.z<l)&&(l=g.z),(d===void 0||g.z>d)&&(d=g.z)}n.set(o,a,l),i.set(c,h,d)}volume(){return 4*Math.PI*this.boundingSphereRadius/3}getAveragePointLocal(t){t===void 0&&(t=new M);const e=this.vertices;for(let n=0;n<e.length;n++)t.vadd(e[n],t);return t.scale(1/e.length,t),t}transformAllPoints(t,e){const n=this.vertices.length,i=this.vertices;if(e){for(let s=0;s<n;s++){const o=i[s];e.vmult(o,o)}for(let s=0;s<this.faceNormals.length;s++){const o=this.faceNormals[s];e.vmult(o,o)}}if(t)for(let s=0;s<n;s++){const o=i[s];o.vadd(t,o)}}pointIsInside(t){const e=this.vertices,n=this.faces,i=this.faceNormals,s=new M;this.getAveragePointLocal(s);for(let o=0;o<this.faces.length;o++){let a=i[o];const l=e[n[o][0]],c=new M;t.vsub(l,c);const h=a.dot(c),d=new M;s.vsub(l,d);const u=a.dot(d);if(h<0&&u>0||h>0&&u<0)return!1}return-1}static project(t,e,n,i,s){const o=t.vertices.length,a=E_;let l=0,c=0;const h=T_,d=t.vertices;h.setZero(),jt.vectorToLocalFrame(n,i,e,a),jt.pointToLocalFrame(n,i,h,h);const u=h.dot(a);c=l=d[0].dot(a);for(let p=1;p<o;p++){const g=d[p].dot(a);g>l&&(l=g),g<c&&(c=g)}if(c-=u,l-=u,c>l){const p=c;c=l,l=p}s[0]=l,s[1]=c}}const uo=[],fo=[];new M;const E_=new M,T_=new M;class Rr extends _t{constructor(t){super({type:_t.types.BOX}),this.halfExtents=t,this.convexPolyhedronRepresentation=null,this.updateConvexPolyhedronRepresentation(),this.updateBoundingSphereRadius()}updateConvexPolyhedronRepresentation(){const t=this.halfExtents.x,e=this.halfExtents.y,n=this.halfExtents.z,i=M,s=[new i(-t,-e,-n),new i(t,-e,-n),new i(t,e,-n),new i(-t,e,-n),new i(-t,-e,n),new i(t,-e,n),new i(t,e,n),new i(-t,e,n)],o=[[3,2,1,0],[4,5,6,7],[5,4,0,1],[2,3,7,6],[0,4,7,3],[1,2,6,5]],a=[new i(0,0,1),new i(0,1,0),new i(1,0,0)],l=new fs({vertices:s,faces:o,axes:a});this.convexPolyhedronRepresentation=l,l.material=this.material}calculateLocalInertia(t,e){return e===void 0&&(e=new M),Rr.calculateInertia(this.halfExtents,t,e),e}static calculateInertia(t,e,n){const i=t;n.x=1/12*e*(2*i.y*2*i.y+2*i.z*2*i.z),n.y=1/12*e*(2*i.x*2*i.x+2*i.z*2*i.z),n.z=1/12*e*(2*i.y*2*i.y+2*i.x*2*i.x)}getSideNormals(t,e){const n=t,i=this.halfExtents;if(n[0].set(i.x,0,0),n[1].set(0,i.y,0),n[2].set(0,0,i.z),n[3].set(-i.x,0,0),n[4].set(0,-i.y,0),n[5].set(0,0,-i.z),e!==void 0)for(let s=0;s!==n.length;s++)e.vmult(n[s],n[s]);return n}volume(){return 8*this.halfExtents.x*this.halfExtents.y*this.halfExtents.z}updateBoundingSphereRadius(){this.boundingSphereRadius=this.halfExtents.length()}forEachWorldCorner(t,e,n){const i=this.halfExtents,s=[[i.x,i.y,i.z],[-i.x,i.y,i.z],[-i.x,-i.y,i.z],[-i.x,-i.y,-i.z],[i.x,-i.y,-i.z],[i.x,i.y,-i.z],[-i.x,i.y,-i.z],[i.x,-i.y,i.z]];for(let o=0;o<s.length;o++)Zn.set(s[o][0],s[o][1],s[o][2]),e.vmult(Zn,Zn),t.vadd(Zn,Zn),n(Zn.x,Zn.y,Zn.z)}calculateWorldAABB(t,e,n,i){const s=this.halfExtents;mn[0].set(s.x,s.y,s.z),mn[1].set(-s.x,s.y,s.z),mn[2].set(-s.x,-s.y,s.z),mn[3].set(-s.x,-s.y,-s.z),mn[4].set(s.x,-s.y,-s.z),mn[5].set(s.x,s.y,-s.z),mn[6].set(-s.x,s.y,-s.z),mn[7].set(s.x,-s.y,s.z);const o=mn[0];e.vmult(o,o),t.vadd(o,o),i.copy(o),n.copy(o);for(let a=1;a<8;a++){const l=mn[a];e.vmult(l,l),t.vadd(l,l);const c=l.x,h=l.y,d=l.z;c>i.x&&(i.x=c),h>i.y&&(i.y=h),d>i.z&&(i.z=d),c<n.x&&(n.x=c),h<n.y&&(n.y=h),d<n.z&&(n.z=d)}}}const Zn=new M,mn=[new M,new M,new M,new M,new M,new M,new M,new M],Ra={DYNAMIC:1,STATIC:2,KINEMATIC:4},Ca={AWAKE:0,SLEEPY:1,SLEEPING:2};class gt extends _h{constructor(t){t===void 0&&(t={}),super(),this.id=gt.idCounter++,this.index=-1,this.world=null,this.vlambda=new M,this.collisionFilterGroup=typeof t.collisionFilterGroup=="number"?t.collisionFilterGroup:1,this.collisionFilterMask=typeof t.collisionFilterMask=="number"?t.collisionFilterMask:-1,this.collisionResponse=typeof t.collisionResponse=="boolean"?t.collisionResponse:!0,this.position=new M,this.previousPosition=new M,this.interpolatedPosition=new M,this.initPosition=new M,t.position&&(this.position.copy(t.position),this.previousPosition.copy(t.position),this.interpolatedPosition.copy(t.position),this.initPosition.copy(t.position)),this.velocity=new M,t.velocity&&this.velocity.copy(t.velocity),this.initVelocity=new M,this.force=new M;const e=typeof t.mass=="number"?t.mass:0;this.mass=e,this.invMass=e>0?1/e:0,this.material=t.material||null,this.linearDamping=typeof t.linearDamping=="number"?t.linearDamping:.01,this.type=e<=0?gt.STATIC:gt.DYNAMIC,typeof t.type==typeof gt.STATIC&&(this.type=t.type),this.allowSleep=typeof t.allowSleep<"u"?t.allowSleep:!0,this.sleepState=gt.AWAKE,this.sleepSpeedLimit=typeof t.sleepSpeedLimit<"u"?t.sleepSpeedLimit:.1,this.sleepTimeLimit=typeof t.sleepTimeLimit<"u"?t.sleepTimeLimit:1,this.timeLastSleepy=0,this.wakeUpAfterNarrowphase=!1,this.torque=new M,this.quaternion=new ve,this.initQuaternion=new ve,this.previousQuaternion=new ve,this.interpolatedQuaternion=new ve,t.quaternion&&(this.quaternion.copy(t.quaternion),this.initQuaternion.copy(t.quaternion),this.previousQuaternion.copy(t.quaternion),this.interpolatedQuaternion.copy(t.quaternion)),this.angularVelocity=new M,t.angularVelocity&&this.angularVelocity.copy(t.angularVelocity),this.initAngularVelocity=new M,this.shapes=[],this.shapeOffsets=[],this.shapeOrientations=[],this.inertia=new M,this.invInertia=new M,this.invInertiaWorld=new dn,this.invMassSolve=0,this.invInertiaSolve=new M,this.invInertiaWorldSolve=new dn,this.fixedRotation=typeof t.fixedRotation<"u"?t.fixedRotation:!1,this.angularDamping=typeof t.angularDamping<"u"?t.angularDamping:.01,this.linearFactor=new M(1,1,1),t.linearFactor&&this.linearFactor.copy(t.linearFactor),this.angularFactor=new M(1,1,1),t.angularFactor&&this.angularFactor.copy(t.angularFactor),this.aabb=new Ke,this.aabbNeedsUpdate=!0,this.boundingRadius=0,this.wlambda=new M,this.isTrigger=!!t.isTrigger,t.shape&&this.addShape(t.shape),this.updateMassProperties()}wakeUp(){const t=this.sleepState;this.sleepState=gt.AWAKE,this.wakeUpAfterNarrowphase=!1,t===gt.SLEEPING&&this.dispatchEvent(gt.wakeupEvent)}sleep(){this.sleepState=gt.SLEEPING,this.velocity.set(0,0,0),this.angularVelocity.set(0,0,0),this.wakeUpAfterNarrowphase=!1}sleepTick(t){if(this.allowSleep){const e=this.sleepState,n=this.velocity.lengthSquared()+this.angularVelocity.lengthSquared(),i=this.sleepSpeedLimit**2;e===gt.AWAKE&&n<i?(this.sleepState=gt.SLEEPY,this.timeLastSleepy=t,this.dispatchEvent(gt.sleepyEvent)):e===gt.SLEEPY&&n>i?this.wakeUp():e===gt.SLEEPY&&t-this.timeLastSleepy>this.sleepTimeLimit&&(this.sleep(),this.dispatchEvent(gt.sleepEvent))}}updateSolveMassProperties(){this.sleepState===gt.SLEEPING||this.type===gt.KINEMATIC?(this.invMassSolve=0,this.invInertiaSolve.setZero(),this.invInertiaWorldSolve.setZero()):(this.invMassSolve=this.invMass,this.invInertiaSolve.copy(this.invInertia),this.invInertiaWorldSolve.copy(this.invInertiaWorld))}pointToLocalFrame(t,e){return e===void 0&&(e=new M),t.vsub(this.position,e),this.quaternion.conjugate().vmult(e,e),e}vectorToLocalFrame(t,e){return e===void 0&&(e=new M),this.quaternion.conjugate().vmult(t,e),e}pointToWorldFrame(t,e){return e===void 0&&(e=new M),this.quaternion.vmult(t,e),e.vadd(this.position,e),e}vectorToWorldFrame(t,e){return e===void 0&&(e=new M),this.quaternion.vmult(t,e),e}addShape(t,e,n){const i=new M,s=new ve;return e&&i.copy(e),n&&s.copy(n),this.shapes.push(t),this.shapeOffsets.push(i),this.shapeOrientations.push(s),this.updateMassProperties(),this.updateBoundingRadius(),this.aabbNeedsUpdate=!0,t.body=this,this}removeShape(t){const e=this.shapes.indexOf(t);return e===-1?(console.warn("Shape does not belong to the body"),this):(this.shapes.splice(e,1),this.shapeOffsets.splice(e,1),this.shapeOrientations.splice(e,1),this.updateMassProperties(),this.updateBoundingRadius(),this.aabbNeedsUpdate=!0,t.body=null,this)}updateBoundingRadius(){const t=this.shapes,e=this.shapeOffsets,n=t.length;let i=0;for(let s=0;s!==n;s++){const o=t[s];o.updateBoundingSphereRadius();const a=e[s].length(),l=o.boundingSphereRadius;a+l>i&&(i=a+l)}this.boundingRadius=i}updateAABB(){const t=this.shapes,e=this.shapeOffsets,n=this.shapeOrientations,i=t.length,s=b_,o=w_,a=this.quaternion,l=this.aabb,c=A_;for(let h=0;h!==i;h++){const d=t[h];a.vmult(e[h],s),s.vadd(this.position,s),a.mult(n[h],o),d.calculateWorldAABB(s,o,c.lowerBound,c.upperBound),h===0?l.copy(c):l.extend(c)}this.aabbNeedsUpdate=!1}updateInertiaWorld(t){const e=this.invInertia;if(!(e.x===e.y&&e.y===e.z&&!t)){const n=R_,i=C_;n.setRotationFromQuaternion(this.quaternion),n.transpose(i),n.scale(e,n),n.mmult(i,this.invInertiaWorld)}}applyForce(t,e){if(e===void 0&&(e=new M),this.type!==gt.DYNAMIC)return;this.sleepState===gt.SLEEPING&&this.wakeUp();const n=P_;e.cross(t,n),this.force.vadd(t,this.force),this.torque.vadd(n,this.torque)}applyLocalForce(t,e){if(e===void 0&&(e=new M),this.type!==gt.DYNAMIC)return;const n=I_,i=L_;this.vectorToWorldFrame(t,n),this.vectorToWorldFrame(e,i),this.applyForce(n,i)}applyTorque(t){this.type===gt.DYNAMIC&&(this.sleepState===gt.SLEEPING&&this.wakeUp(),this.torque.vadd(t,this.torque))}applyImpulse(t,e){if(e===void 0&&(e=new M),this.type!==gt.DYNAMIC)return;this.sleepState===gt.SLEEPING&&this.wakeUp();const n=e,i=D_;i.copy(t),i.scale(this.invMass,i),this.velocity.vadd(i,this.velocity);const s=N_;n.cross(t,s),this.invInertiaWorld.vmult(s,s),this.angularVelocity.vadd(s,this.angularVelocity)}applyLocalImpulse(t,e){if(e===void 0&&(e=new M),this.type!==gt.DYNAMIC)return;const n=U_,i=F_;this.vectorToWorldFrame(t,n),this.vectorToWorldFrame(e,i),this.applyImpulse(n,i)}updateMassProperties(){const t=O_;this.invMass=this.mass>0?1/this.mass:0;const e=this.inertia,n=this.fixedRotation;this.updateAABB(),t.set((this.aabb.upperBound.x-this.aabb.lowerBound.x)/2,(this.aabb.upperBound.y-this.aabb.lowerBound.y)/2,(this.aabb.upperBound.z-this.aabb.lowerBound.z)/2),Rr.calculateInertia(t,this.mass,e),this.invInertia.set(e.x>0&&!n?1/e.x:0,e.y>0&&!n?1/e.y:0,e.z>0&&!n?1/e.z:0),this.updateInertiaWorld(!0)}getVelocityAtWorldPoint(t,e){const n=new M;return t.vsub(this.position,n),this.angularVelocity.cross(n,e),this.velocity.vadd(e,e),e}integrate(t,e,n){if(this.previousPosition.copy(this.position),this.previousQuaternion.copy(this.quaternion),!(this.type===gt.DYNAMIC||this.type===gt.KINEMATIC)||this.sleepState===gt.SLEEPING)return;const i=this.velocity,s=this.angularVelocity,o=this.position,a=this.force,l=this.torque,c=this.quaternion,h=this.invMass,d=this.invInertiaWorld,u=this.linearFactor,p=h*t;i.x+=a.x*p*u.x,i.y+=a.y*p*u.y,i.z+=a.z*p*u.z;const g=d.elements,_=this.angularFactor,m=l.x*_.x,f=l.y*_.y,v=l.z*_.z;s.x+=t*(g[0]*m+g[1]*f+g[2]*v),s.y+=t*(g[3]*m+g[4]*f+g[5]*v),s.z+=t*(g[6]*m+g[7]*f+g[8]*v),o.x+=i.x*t,o.y+=i.y*t,o.z+=i.z*t,c.integrate(this.angularVelocity,t,this.angularFactor,c),e&&(n?c.normalizeFast():c.normalize()),this.aabbNeedsUpdate=!0,this.updateInertiaWorld()}}gt.idCounter=0;gt.COLLIDE_EVENT_NAME="collide";gt.DYNAMIC=Ra.DYNAMIC;gt.STATIC=Ra.STATIC;gt.KINEMATIC=Ra.KINEMATIC;gt.AWAKE=Ca.AWAKE;gt.SLEEPY=Ca.SLEEPY;gt.SLEEPING=Ca.SLEEPING;gt.wakeupEvent={type:"wakeup"};gt.sleepyEvent={type:"sleepy"};gt.sleepEvent={type:"sleep"};const b_=new M,w_=new ve,A_=new Ke,R_=new dn,C_=new dn;new dn;const P_=new M,I_=new M,L_=new M,D_=new M,N_=new M,U_=new M,F_=new M,O_=new M;class vh{constructor(){this.world=null,this.useBoundingBoxes=!1,this.dirty=!0}collisionPairs(t,e,n){throw new Error("collisionPairs not implemented for this BroadPhase class!")}needBroadphaseCollision(t,e){return!((t.collisionFilterGroup&e.collisionFilterMask)===0||(e.collisionFilterGroup&t.collisionFilterMask)===0||((t.type&gt.STATIC)!==0||t.sleepState===gt.SLEEPING)&&((e.type&gt.STATIC)!==0||e.sleepState===gt.SLEEPING))}intersectionTest(t,e,n,i){this.useBoundingBoxes?this.doBoundingBoxBroadphase(t,e,n,i):this.doBoundingSphereBroadphase(t,e,n,i)}doBoundingSphereBroadphase(t,e,n,i){const s=z_;e.position.vsub(t.position,s);const o=(t.boundingRadius+e.boundingRadius)**2;s.lengthSquared()<o&&(n.push(t),i.push(e))}doBoundingBoxBroadphase(t,e,n,i){t.aabbNeedsUpdate&&t.updateAABB(),e.aabbNeedsUpdate&&e.updateAABB(),t.aabb.overlaps(e.aabb)&&(n.push(t),i.push(e))}makePairsUnique(t,e){const n=B_,i=k_,s=V_,o=t.length;for(let a=0;a!==o;a++)i[a]=t[a],s[a]=e[a];t.length=0,e.length=0;for(let a=0;a!==o;a++){const l=i[a].id,c=s[a].id,h=l<c?`${l},${c}`:`${c},${l}`;n[h]=a,n.keys.push(h)}for(let a=0;a!==n.keys.length;a++){const l=n.keys.pop(),c=n[l];t.push(i[c]),e.push(s[c]),delete n[l]}}setWorld(t){}static boundingSphereCheck(t,e){const n=new M;t.position.vsub(e.position,n);const i=t.shapes[0],s=e.shapes[0];return Math.pow(i.boundingSphereRadius+s.boundingSphereRadius,2)>n.lengthSquared()}aabbQuery(t,e,n){return console.warn(".aabbQuery is not implemented in this Broadphase subclass."),[]}}const z_=new M;new M;new ve;new M;const B_={keys:[]},k_=[],V_=[];new M;new M;new M;class G_ extends vh{constructor(){super()}collisionPairs(t,e,n){const i=t.bodies,s=i.length;let o,a;for(let l=0;l!==s;l++)for(let c=0;c!==l;c++)o=i[l],a=i[c],this.needBroadphaseCollision(o,a)&&this.intersectionTest(o,a,e,n)}aabbQuery(t,e,n){n===void 0&&(n=[]);for(let i=0;i<t.bodies.length;i++){const s=t.bodies[i];s.aabbNeedsUpdate&&s.updateAABB(),s.aabb.overlaps(e)&&n.push(s)}return n}}class Sr{constructor(){this.rayFromWorld=new M,this.rayToWorld=new M,this.hitNormalWorld=new M,this.hitPointWorld=new M,this.hasHit=!1,this.shape=null,this.body=null,this.hitFaceIndex=-1,this.distance=-1,this.shouldStop=!1}reset(){this.rayFromWorld.setZero(),this.rayToWorld.setZero(),this.hitNormalWorld.setZero(),this.hitPointWorld.setZero(),this.hasHit=!1,this.shape=null,this.body=null,this.hitFaceIndex=-1,this.distance=-1,this.shouldStop=!1}abort(){this.shouldStop=!0}set(t,e,n,i,s,o,a){this.rayFromWorld.copy(t),this.rayToWorld.copy(e),this.hitNormalWorld.copy(n),this.hitPointWorld.copy(i),this.shape=s,this.body=o,this.distance=a}}let xh,yh,Mh,Sh,Eh,Th,bh;const Pa={CLOSEST:1,ANY:2,ALL:4};xh=_t.types.SPHERE;yh=_t.types.PLANE;Mh=_t.types.BOX;Sh=_t.types.CYLINDER;Eh=_t.types.CONVEXPOLYHEDRON;Th=_t.types.HEIGHTFIELD;bh=_t.types.TRIMESH;class _e{get[xh](){return this._intersectSphere}get[yh](){return this._intersectPlane}get[Mh](){return this._intersectBox}get[Sh](){return this._intersectConvex}get[Eh](){return this._intersectConvex}get[Th](){return this._intersectHeightfield}get[bh](){return this._intersectTrimesh}constructor(t,e){t===void 0&&(t=new M),e===void 0&&(e=new M),this.from=t.clone(),this.to=e.clone(),this.direction=new M,this.precision=1e-4,this.checkCollisionResponse=!0,this.skipBackfaces=!1,this.collisionFilterMask=-1,this.collisionFilterGroup=-1,this.mode=_e.ANY,this.result=new Sr,this.hasHit=!1,this.callback=n=>{}}intersectWorld(t,e){return this.mode=e.mode||_e.ANY,this.result=e.result||new Sr,this.skipBackfaces=!!e.skipBackfaces,this.collisionFilterMask=typeof e.collisionFilterMask<"u"?e.collisionFilterMask:-1,this.collisionFilterGroup=typeof e.collisionFilterGroup<"u"?e.collisionFilterGroup:-1,this.checkCollisionResponse=typeof e.checkCollisionResponse<"u"?e.checkCollisionResponse:!0,e.from&&this.from.copy(e.from),e.to&&this.to.copy(e.to),this.callback=e.callback||(()=>{}),this.hasHit=!1,this.result.reset(),this.updateDirection(),this.getAABB(el),po.length=0,t.broadphase.aabbQuery(t,el,po),this.intersectBodies(po),this.hasHit}intersectBody(t,e){e&&(this.result=e,this.updateDirection());const n=this.checkCollisionResponse;if(n&&!t.collisionResponse||(this.collisionFilterGroup&t.collisionFilterMask)===0||(t.collisionFilterGroup&this.collisionFilterMask)===0)return;const i=H_,s=W_;for(let o=0,a=t.shapes.length;o<a;o++){const l=t.shapes[o];if(!(n&&!l.collisionResponse)&&(t.quaternion.mult(t.shapeOrientations[o],s),t.quaternion.vmult(t.shapeOffsets[o],i),i.vadd(t.position,i),this.intersectShape(l,s,i,t),this.result.shouldStop))break}}intersectBodies(t,e){e&&(this.result=e,this.updateDirection());for(let n=0,i=t.length;!this.result.shouldStop&&n<i;n++)this.intersectBody(t[n])}updateDirection(){this.to.vsub(this.from,this.direction),this.direction.normalize()}intersectShape(t,e,n,i){const s=this.from;if(sv(s,this.direction,n)>t.boundingSphereRadius)return;const a=this[t.type];a&&a.call(this,t,e,n,i,t)}_intersectBox(t,e,n,i,s){return this._intersectConvex(t.convexPolyhedronRepresentation,e,n,i,s)}_intersectPlane(t,e,n,i,s){const o=this.from,a=this.to,l=this.direction,c=new M(0,0,1);e.vmult(c,c);const h=new M;o.vsub(n,h);const d=h.dot(c);a.vsub(n,h);const u=h.dot(c);if(d*u>0||o.distanceTo(a)<d)return;const p=c.dot(l);if(Math.abs(p)<this.precision)return;const g=new M,_=new M,m=new M;o.vsub(n,g);const f=-c.dot(g)/p;l.scale(f,_),o.vadd(_,m),this.reportIntersection(c,m,s,i,-1)}getAABB(t){const{lowerBound:e,upperBound:n}=t,i=this.to,s=this.from;e.x=Math.min(i.x,s.x),e.y=Math.min(i.y,s.y),e.z=Math.min(i.z,s.z),n.x=Math.max(i.x,s.x),n.y=Math.max(i.y,s.y),n.z=Math.max(i.z,s.z)}_intersectHeightfield(t,e,n,i,s){t.data,t.elementSize;const o=X_;o.from.copy(this.from),o.to.copy(this.to),jt.pointToLocalFrame(n,e,o.from,o.from),jt.pointToLocalFrame(n,e,o.to,o.to),o.updateDirection();const a=q_;let l,c,h,d;l=c=0,h=d=t.data.length-1;const u=new Ke;o.getAABB(u),t.getIndexOfPosition(u.lowerBound.x,u.lowerBound.y,a,!0),l=Math.max(l,a[0]),c=Math.max(c,a[1]),t.getIndexOfPosition(u.upperBound.x,u.upperBound.y,a,!0),h=Math.min(h,a[0]+1),d=Math.min(d,a[1]+1);for(let p=l;p<h;p++)for(let g=c;g<d;g++){if(this.result.shouldStop)return;if(t.getAabbAtIndex(p,g,u),!!u.overlapsRay(o)){if(t.getConvexTrianglePillar(p,g,!1),jt.pointToWorldFrame(n,e,t.pillarOffset,nr),this._intersectConvex(t.pillarConvex,e,nr,i,s,nl),this.result.shouldStop)return;t.getConvexTrianglePillar(p,g,!0),jt.pointToWorldFrame(n,e,t.pillarOffset,nr),this._intersectConvex(t.pillarConvex,e,nr,i,s,nl)}}}_intersectSphere(t,e,n,i,s){const o=this.from,a=this.to,l=t.radius,c=(a.x-o.x)**2+(a.y-o.y)**2+(a.z-o.z)**2,h=2*((a.x-o.x)*(o.x-n.x)+(a.y-o.y)*(o.y-n.y)+(a.z-o.z)*(o.z-n.z)),d=(o.x-n.x)**2+(o.y-n.y)**2+(o.z-n.z)**2-l**2,u=h**2-4*c*d,p=Y_,g=$_;if(!(u<0))if(u===0)o.lerp(a,u,p),p.vsub(n,g),g.normalize(),this.reportIntersection(g,p,s,i,-1);else{const _=(-h-Math.sqrt(u))/(2*c),m=(-h+Math.sqrt(u))/(2*c);if(_>=0&&_<=1&&(o.lerp(a,_,p),p.vsub(n,g),g.normalize(),this.reportIntersection(g,p,s,i,-1)),this.result.shouldStop)return;m>=0&&m<=1&&(o.lerp(a,m,p),p.vsub(n,g),g.normalize(),this.reportIntersection(g,p,s,i,-1))}}_intersectConvex(t,e,n,i,s,o){const a=Z_,l=il,c=o&&o.faceList||null,h=t.faces,d=t.vertices,u=t.faceNormals,p=this.direction,g=this.from,_=this.to,m=g.distanceTo(_),f=c?c.length:h.length,v=this.result;for(let S=0;!v.shouldStop&&S<f;S++){const x=c?c[S]:S,w=h[x],A=u[x],R=e,L=n;l.copy(d[w[0]]),R.vmult(l,l),l.vadd(L,l),l.vsub(g,l),R.vmult(A,a);const b=p.dot(a);if(Math.abs(b)<this.precision)continue;const E=a.dot(l)/b;if(!(E<0)){p.scale(E,Ge),Ge.vadd(g,Ge),hn.copy(d[w[0]]),R.vmult(hn,hn),L.vadd(hn,hn);for(let P=1;!v.shouldStop&&P<w.length-1;P++){gn.copy(d[w[P]]),_n.copy(d[w[P+1]]),R.vmult(gn,gn),R.vmult(_n,_n),L.vadd(gn,gn),L.vadd(_n,_n);const H=Ge.distanceTo(g);!(_e.pointInTriangle(Ge,hn,gn,_n)||_e.pointInTriangle(Ge,gn,hn,_n))||H>m||this.reportIntersection(a,Ge,s,i,x)}}}}_intersectTrimesh(t,e,n,i,s,o){const a=j_,l=nv,c=iv,h=il,d=K_,u=J_,p=Q_,g=ev,_=tv,m=t.indices;t.vertices;const f=this.from,v=this.to,S=this.direction;c.position.copy(n),c.quaternion.copy(e),jt.vectorToLocalFrame(n,e,S,d),jt.pointToLocalFrame(n,e,f,u),jt.pointToLocalFrame(n,e,v,p),p.x*=t.scale.x,p.y*=t.scale.y,p.z*=t.scale.z,u.x*=t.scale.x,u.y*=t.scale.y,u.z*=t.scale.z,p.vsub(u,d),d.normalize();const x=u.distanceSquared(p);t.tree.rayQuery(this,c,l);for(let w=0,A=l.length;!this.result.shouldStop&&w!==A;w++){const R=l[w];t.getNormal(R,a),t.getVertex(m[R*3],hn),hn.vsub(u,h);const L=d.dot(a),b=a.dot(h)/L;if(b<0)continue;d.scale(b,Ge),Ge.vadd(u,Ge),t.getVertex(m[R*3+1],gn),t.getVertex(m[R*3+2],_n);const E=Ge.distanceSquared(u);!(_e.pointInTriangle(Ge,gn,hn,_n)||_e.pointInTriangle(Ge,hn,gn,_n))||E>x||(jt.vectorToWorldFrame(e,a,_),jt.pointToWorldFrame(n,e,Ge,g),this.reportIntersection(_,g,s,i,R))}l.length=0}reportIntersection(t,e,n,i,s){const o=this.from,a=this.to,l=o.distanceTo(e),c=this.result;if(!(this.skipBackfaces&&t.dot(this.direction)>0))switch(c.hitFaceIndex=typeof s<"u"?s:-1,this.mode){case _e.ALL:this.hasHit=!0,c.set(o,a,t,e,n,i,l),c.hasHit=!0,this.callback(c);break;case _e.CLOSEST:(l<c.distance||!c.hasHit)&&(this.hasHit=!0,c.hasHit=!0,c.set(o,a,t,e,n,i,l));break;case _e.ANY:this.hasHit=!0,c.hasHit=!0,c.set(o,a,t,e,n,i,l),c.shouldStop=!0;break}}static pointInTriangle(t,e,n,i){i.vsub(e,mi),n.vsub(e,as),t.vsub(e,mo);const s=mi.dot(mi),o=mi.dot(as),a=mi.dot(mo),l=as.dot(as),c=as.dot(mo);let h,d;return(h=l*a-o*c)>=0&&(d=s*c-o*a)>=0&&h+d<s*l-o*o}}_e.CLOSEST=Pa.CLOSEST;_e.ANY=Pa.ANY;_e.ALL=Pa.ALL;const el=new Ke,po=[],as=new M,mo=new M,H_=new M,W_=new ve,Ge=new M,hn=new M,gn=new M,_n=new M;new M;new Sr;const nl={faceList:[0]},nr=new M,X_=new _e,q_=[],Y_=new M,$_=new M,Z_=new M;new M;new M;const il=new M,j_=new M,K_=new M,J_=new M,Q_=new M,tv=new M,ev=new M;new Ke;const nv=[],iv=new jt,mi=new M,ir=new M;function sv(r,t,e){e.vsub(r,mi);const n=mi.dot(t);return t.scale(n,ir),ir.vadd(r,ir),e.distanceTo(ir)}class Bi extends vh{static checkBounds(t,e,n){let i,s;n===0?(i=t.position.x,s=e.position.x):n===1?(i=t.position.y,s=e.position.y):n===2&&(i=t.position.z,s=e.position.z);const o=t.boundingRadius,a=e.boundingRadius,l=i+o;return s-a<l}static insertionSortX(t){for(let e=1,n=t.length;e<n;e++){const i=t[e];let s;for(s=e-1;s>=0&&!(t[s].aabb.lowerBound.x<=i.aabb.lowerBound.x);s--)t[s+1]=t[s];t[s+1]=i}return t}static insertionSortY(t){for(let e=1,n=t.length;e<n;e++){const i=t[e];let s;for(s=e-1;s>=0&&!(t[s].aabb.lowerBound.y<=i.aabb.lowerBound.y);s--)t[s+1]=t[s];t[s+1]=i}return t}static insertionSortZ(t){for(let e=1,n=t.length;e<n;e++){const i=t[e];let s;for(s=e-1;s>=0&&!(t[s].aabb.lowerBound.z<=i.aabb.lowerBound.z);s--)t[s+1]=t[s];t[s+1]=i}return t}constructor(t){super(),this.axisList=[],this.world=null,this.axisIndex=0;const e=this.axisList;this._addBodyHandler=n=>{e.push(n.body)},this._removeBodyHandler=n=>{const i=e.indexOf(n.body);i!==-1&&e.splice(i,1)},t&&this.setWorld(t)}setWorld(t){this.axisList.length=0;for(let e=0;e<t.bodies.length;e++)this.axisList.push(t.bodies[e]);t.removeEventListener("addBody",this._addBodyHandler),t.removeEventListener("removeBody",this._removeBodyHandler),t.addEventListener("addBody",this._addBodyHandler),t.addEventListener("removeBody",this._removeBodyHandler),this.world=t,this.dirty=!0}collisionPairs(t,e,n){const i=this.axisList,s=i.length,o=this.axisIndex;let a,l;for(this.dirty&&(this.sortList(),this.dirty=!1),a=0;a!==s;a++){const c=i[a];for(l=a+1;l<s;l++){const h=i[l];if(this.needBroadphaseCollision(c,h)){if(!Bi.checkBounds(c,h,o))break;this.intersectionTest(c,h,e,n)}}}}sortList(){const t=this.axisList,e=this.axisIndex,n=t.length;for(let i=0;i!==n;i++){const s=t[i];s.aabbNeedsUpdate&&s.updateAABB()}e===0?Bi.insertionSortX(t):e===1?Bi.insertionSortY(t):e===2&&Bi.insertionSortZ(t)}autoDetectAxis(){let t=0,e=0,n=0,i=0,s=0,o=0;const a=this.axisList,l=a.length,c=1/l;for(let p=0;p!==l;p++){const g=a[p],_=g.position.x;t+=_,e+=_*_;const m=g.position.y;n+=m,i+=m*m;const f=g.position.z;s+=f,o+=f*f}const h=e-t*t*c,d=i-n*n*c,u=o-s*s*c;h>d?h>u?this.axisIndex=0:this.axisIndex=2:d>u?this.axisIndex=1:this.axisIndex=2}aabbQuery(t,e,n){n===void 0&&(n=[]),this.dirty&&(this.sortList(),this.dirty=!1);const i=this.axisIndex;let s="x";i===1&&(s="y"),i===2&&(s="z");const o=this.axisList;e.lowerBound[s],e.upperBound[s];for(let a=0;a<o.length;a++){const l=o[a];l.aabbNeedsUpdate&&l.updateAABB(),l.aabb.overlaps(e)&&n.push(l)}return n}}class rv{static defaults(t,e){t===void 0&&(t={});for(let n in e)n in t||(t[n]=e[n]);return t}}class sl{constructor(){this.spatial=new M,this.rotational=new M}multiplyElement(t){return t.spatial.dot(this.spatial)+t.rotational.dot(this.rotational)}multiplyVectors(t,e){return t.dot(this.spatial)+e.dot(this.rotational)}}class bs{constructor(t,e,n,i){n===void 0&&(n=-1e6),i===void 0&&(i=1e6),this.id=bs.idCounter++,this.minForce=n,this.maxForce=i,this.bi=t,this.bj=e,this.a=0,this.b=0,this.eps=0,this.jacobianElementA=new sl,this.jacobianElementB=new sl,this.enabled=!0,this.multiplier=0,this.setSpookParams(1e7,4,1/60)}setSpookParams(t,e,n){const i=e,s=t,o=n;this.a=4/(o*(1+4*i)),this.b=4*i/(1+4*i),this.eps=4/(o*o*s*(1+4*i))}computeB(t,e,n){const i=this.computeGW(),s=this.computeGq(),o=this.computeGiMf();return-s*t-i*e-o*n}computeGq(){const t=this.jacobianElementA,e=this.jacobianElementB,n=this.bi,i=this.bj,s=n.position,o=i.position;return t.spatial.dot(s)+e.spatial.dot(o)}computeGW(){const t=this.jacobianElementA,e=this.jacobianElementB,n=this.bi,i=this.bj,s=n.velocity,o=i.velocity,a=n.angularVelocity,l=i.angularVelocity;return t.multiplyVectors(s,a)+e.multiplyVectors(o,l)}computeGWlambda(){const t=this.jacobianElementA,e=this.jacobianElementB,n=this.bi,i=this.bj,s=n.vlambda,o=i.vlambda,a=n.wlambda,l=i.wlambda;return t.multiplyVectors(s,a)+e.multiplyVectors(o,l)}computeGiMf(){const t=this.jacobianElementA,e=this.jacobianElementB,n=this.bi,i=this.bj,s=n.force,o=n.torque,a=i.force,l=i.torque,c=n.invMassSolve,h=i.invMassSolve;return s.scale(c,rl),a.scale(h,ol),n.invInertiaWorldSolve.vmult(o,al),i.invInertiaWorldSolve.vmult(l,cl),t.multiplyVectors(rl,al)+e.multiplyVectors(ol,cl)}computeGiMGt(){const t=this.jacobianElementA,e=this.jacobianElementB,n=this.bi,i=this.bj,s=n.invMassSolve,o=i.invMassSolve,a=n.invInertiaWorldSolve,l=i.invInertiaWorldSolve;let c=s+o;return a.vmult(t.rotational,sr),c+=sr.dot(t.rotational),l.vmult(e.rotational,sr),c+=sr.dot(e.rotational),c}addToWlambda(t){const e=this.jacobianElementA,n=this.jacobianElementB,i=this.bi,s=this.bj,o=ov;i.vlambda.addScaledVector(i.invMassSolve*t,e.spatial,i.vlambda),s.vlambda.addScaledVector(s.invMassSolve*t,n.spatial,s.vlambda),i.invInertiaWorldSolve.vmult(e.rotational,o),i.wlambda.addScaledVector(t,o,i.wlambda),s.invInertiaWorldSolve.vmult(n.rotational,o),s.wlambda.addScaledVector(t,o,s.wlambda)}computeC(){return this.computeGiMGt()+this.eps}}bs.idCounter=0;const rl=new M,ol=new M,al=new M,cl=new M,sr=new M,ov=new M;class av extends bs{constructor(t,e,n){n===void 0&&(n=1e6),super(t,e,0,n),this.restitution=0,this.ri=new M,this.rj=new M,this.ni=new M}computeB(t){const e=this.a,n=this.b,i=this.bi,s=this.bj,o=this.ri,a=this.rj,l=cv,c=lv,h=i.velocity,d=i.angularVelocity;i.force,i.torque;const u=s.velocity,p=s.angularVelocity;s.force,s.torque;const g=hv,_=this.jacobianElementA,m=this.jacobianElementB,f=this.ni;o.cross(f,l),a.cross(f,c),f.negate(_.spatial),l.negate(_.rotational),m.spatial.copy(f),m.rotational.copy(c),g.copy(s.position),g.vadd(a,g),g.vsub(i.position,g),g.vsub(o,g);const v=f.dot(g),S=this.restitution+1,x=S*u.dot(f)-S*h.dot(f)+p.dot(c)-d.dot(l),w=this.computeGiMf();return-v*e-x*n-t*w}getImpactVelocityAlongNormal(){const t=uv,e=dv,n=fv,i=pv,s=mv;return this.bi.position.vadd(this.ri,n),this.bj.position.vadd(this.rj,i),this.bi.getVelocityAtWorldPoint(n,t),this.bj.getVelocityAtWorldPoint(i,e),t.vsub(e,s),this.ni.dot(s)}}const cv=new M,lv=new M,hv=new M,uv=new M,dv=new M,fv=new M,pv=new M,mv=new M;new M;new M;new M;new M;new M;new M;new M;new M;new M;new M;class ll extends bs{constructor(t,e,n){super(t,e,-n,n),this.ri=new M,this.rj=new M,this.t=new M}computeB(t){this.a;const e=this.b;this.bi,this.bj;const n=this.ri,i=this.rj,s=gv,o=_v,a=this.t;n.cross(a,s),i.cross(a,o);const l=this.jacobianElementA,c=this.jacobianElementB;a.negate(l.spatial),s.negate(l.rotational),c.spatial.copy(a),c.rotational.copy(o);const h=this.computeGW(),d=this.computeGiMf();return-h*e-t*d}}const gv=new M,_v=new M;class ws{constructor(t,e,n){n=rv.defaults(n,{friction:.3,restitution:.3,contactEquationStiffness:1e7,contactEquationRelaxation:3,frictionEquationStiffness:1e7,frictionEquationRelaxation:3}),this.id=ws.idCounter++,this.materials=[t,e],this.friction=n.friction,this.restitution=n.restitution,this.contactEquationStiffness=n.contactEquationStiffness,this.contactEquationRelaxation=n.contactEquationRelaxation,this.frictionEquationStiffness=n.frictionEquationStiffness,this.frictionEquationRelaxation=n.frictionEquationRelaxation}}ws.idCounter=0;class Zi{constructor(t){t===void 0&&(t={});let e="";typeof t=="string"&&(e=t,t={}),this.name=e,this.id=Zi.idCounter++,this.friction=typeof t.friction<"u"?t.friction:-1,this.restitution=typeof t.restitution<"u"?t.restitution:-1}}Zi.idCounter=0;new M;new M;new M;new M;new M;new M;new M;new M;new M;new M;new M;new M;new M;new M;new M;new M;new M;new M;new M;new _e;new M;new M;new M;new M(1,0,0),new M(0,1,0),new M(0,0,1);new M;new M;new M;new M;new M;new M;new M;new M;new M;new M;new M;class vv extends _t{constructor(t){if(super({type:_t.types.SPHERE}),this.radius=t!==void 0?t:1,this.radius<0)throw new Error("The sphere radius cannot be negative.");this.updateBoundingSphereRadius()}calculateLocalInertia(t,e){e===void 0&&(e=new M);const n=2*t*this.radius*this.radius/5;return e.x=n,e.y=n,e.z=n,e}volume(){return 4*Math.PI*Math.pow(this.radius,3)/3}updateBoundingSphereRadius(){this.boundingSphereRadius=this.radius}calculateWorldAABB(t,e,n,i){const s=this.radius,o=["x","y","z"];for(let a=0;a<o.length;a++){const l=o[a];n[l]=t[l]-s,i[l]=t[l]+s}}}new M;new M;new M;new M;new M;new M;new M;new M;new M;new M;new M;new M;new M;new M;new M;new M;new M;new M;new M;new M;new Ke;new M;new Ke;new M;new M;new M;new M;new M;new M;new M;new Ke;new M;new jt;new Ke;class xv{constructor(){this.equations=[]}solve(t,e){return 0}addEquation(t){t.enabled&&!t.bi.isTrigger&&!t.bj.isTrigger&&this.equations.push(t)}removeEquation(t){const e=this.equations,n=e.indexOf(t);n!==-1&&e.splice(n,1)}removeAllEquations(){this.equations.length=0}}class yv extends xv{constructor(){super(),this.iterations=10,this.tolerance=1e-7}solve(t,e){let n=0;const i=this.iterations,s=this.tolerance*this.tolerance,o=this.equations,a=o.length,l=e.bodies,c=l.length,h=t;let d,u,p,g,_,m;if(a!==0)for(let x=0;x!==c;x++)l[x].updateSolveMassProperties();const f=Sv,v=Ev,S=Mv;f.length=a,v.length=a,S.length=a;for(let x=0;x!==a;x++){const w=o[x];S[x]=0,v[x]=w.computeB(h),f[x]=1/w.computeC()}if(a!==0){for(let A=0;A!==c;A++){const R=l[A],L=R.vlambda,b=R.wlambda;L.set(0,0,0),b.set(0,0,0)}for(n=0;n!==i;n++){g=0;for(let A=0;A!==a;A++){const R=o[A];d=v[A],u=f[A],m=S[A],_=R.computeGWlambda(),p=u*(d-_-R.eps*m),m+p<R.minForce?p=R.minForce-m:m+p>R.maxForce&&(p=R.maxForce-m),S[A]+=p,g+=p>0?p:-p,R.addToWlambda(p)}if(g*g<s)break}for(let A=0;A!==c;A++){const R=l[A],L=R.velocity,b=R.angularVelocity;R.vlambda.vmul(R.linearFactor,R.vlambda),L.vadd(R.vlambda,L),R.wlambda.vmul(R.angularFactor,R.wlambda),b.vadd(R.wlambda,b)}let x=o.length;const w=1/h;for(;x--;)o[x].multiplier=S[x]*w}return n}}const Mv=[],Sv=[],Ev=[];class Tv{constructor(){this.objects=[],this.type=Object}release(){const t=arguments.length;for(let e=0;e!==t;e++)this.objects.push(e<0||arguments.length<=e?void 0:arguments[e]);return this}get(){return this.objects.length===0?this.constructObject():this.objects.pop()}constructObject(){throw new Error("constructObject() not implemented in this Pool subclass yet!")}resize(t){const e=this.objects;for(;e.length>t;)e.pop();for(;e.length<t;)e.push(this.constructObject());return this}}class bv extends Tv{constructor(){super(...arguments),this.type=M}constructObject(){return new M}}const ae={sphereSphere:_t.types.SPHERE,spherePlane:_t.types.SPHERE|_t.types.PLANE,boxBox:_t.types.BOX|_t.types.BOX,sphereBox:_t.types.SPHERE|_t.types.BOX,planeBox:_t.types.PLANE|_t.types.BOX,convexConvex:_t.types.CONVEXPOLYHEDRON,sphereConvex:_t.types.SPHERE|_t.types.CONVEXPOLYHEDRON,planeConvex:_t.types.PLANE|_t.types.CONVEXPOLYHEDRON,boxConvex:_t.types.BOX|_t.types.CONVEXPOLYHEDRON,sphereHeightfield:_t.types.SPHERE|_t.types.HEIGHTFIELD,boxHeightfield:_t.types.BOX|_t.types.HEIGHTFIELD,convexHeightfield:_t.types.CONVEXPOLYHEDRON|_t.types.HEIGHTFIELD,sphereParticle:_t.types.PARTICLE|_t.types.SPHERE,planeParticle:_t.types.PLANE|_t.types.PARTICLE,boxParticle:_t.types.BOX|_t.types.PARTICLE,convexParticle:_t.types.PARTICLE|_t.types.CONVEXPOLYHEDRON,cylinderCylinder:_t.types.CYLINDER,sphereCylinder:_t.types.SPHERE|_t.types.CYLINDER,planeCylinder:_t.types.PLANE|_t.types.CYLINDER,boxCylinder:_t.types.BOX|_t.types.CYLINDER,convexCylinder:_t.types.CONVEXPOLYHEDRON|_t.types.CYLINDER,heightfieldCylinder:_t.types.HEIGHTFIELD|_t.types.CYLINDER,particleCylinder:_t.types.PARTICLE|_t.types.CYLINDER,sphereTrimesh:_t.types.SPHERE|_t.types.TRIMESH,planeTrimesh:_t.types.PLANE|_t.types.TRIMESH};class wv{get[ae.sphereSphere](){return this.sphereSphere}get[ae.spherePlane](){return this.spherePlane}get[ae.boxBox](){return this.boxBox}get[ae.sphereBox](){return this.sphereBox}get[ae.planeBox](){return this.planeBox}get[ae.convexConvex](){return this.convexConvex}get[ae.sphereConvex](){return this.sphereConvex}get[ae.planeConvex](){return this.planeConvex}get[ae.boxConvex](){return this.boxConvex}get[ae.sphereHeightfield](){return this.sphereHeightfield}get[ae.boxHeightfield](){return this.boxHeightfield}get[ae.convexHeightfield](){return this.convexHeightfield}get[ae.sphereParticle](){return this.sphereParticle}get[ae.planeParticle](){return this.planeParticle}get[ae.boxParticle](){return this.boxParticle}get[ae.convexParticle](){return this.convexParticle}get[ae.cylinderCylinder](){return this.convexConvex}get[ae.sphereCylinder](){return this.sphereConvex}get[ae.planeCylinder](){return this.planeConvex}get[ae.boxCylinder](){return this.boxConvex}get[ae.convexCylinder](){return this.convexConvex}get[ae.heightfieldCylinder](){return this.heightfieldCylinder}get[ae.particleCylinder](){return this.particleCylinder}get[ae.sphereTrimesh](){return this.sphereTrimesh}get[ae.planeTrimesh](){return this.planeTrimesh}constructor(t){this.contactPointPool=[],this.frictionEquationPool=[],this.result=[],this.frictionResult=[],this.v3pool=new bv,this.world=t,this.currentContactMaterial=t.defaultContactMaterial,this.enableFrictionReduction=!1}createContactEquation(t,e,n,i,s,o){let a;this.contactPointPool.length?(a=this.contactPointPool.pop(),a.bi=t,a.bj=e):a=new av(t,e),a.enabled=t.collisionResponse&&e.collisionResponse&&n.collisionResponse&&i.collisionResponse;const l=this.currentContactMaterial;a.restitution=l.restitution,a.setSpookParams(l.contactEquationStiffness,l.contactEquationRelaxation,this.world.dt);const c=n.material||t.material,h=i.material||e.material;return c&&h&&c.restitution>=0&&h.restitution>=0&&(a.restitution=c.restitution*h.restitution),a.si=s||n,a.sj=o||i,a}createFrictionEquationsFromContact(t,e){const n=t.bi,i=t.bj,s=t.si,o=t.sj,a=this.world,l=this.currentContactMaterial;let c=l.friction;const h=s.material||n.material,d=o.material||i.material;if(h&&d&&h.friction>=0&&d.friction>=0&&(c=h.friction*d.friction),c>0){const u=c*(a.frictionGravity||a.gravity).length();let p=n.invMass+i.invMass;p>0&&(p=1/p);const g=this.frictionEquationPool,_=g.length?g.pop():new ll(n,i,u*p),m=g.length?g.pop():new ll(n,i,u*p);return _.bi=m.bi=n,_.bj=m.bj=i,_.minForce=m.minForce=-u*p,_.maxForce=m.maxForce=u*p,_.ri.copy(t.ri),_.rj.copy(t.rj),m.ri.copy(t.ri),m.rj.copy(t.rj),t.ni.tangents(_.t,m.t),_.setSpookParams(l.frictionEquationStiffness,l.frictionEquationRelaxation,a.dt),m.setSpookParams(l.frictionEquationStiffness,l.frictionEquationRelaxation,a.dt),_.enabled=m.enabled=t.enabled,e.push(_,m),!0}return!1}createFrictionFromAverage(t){let e=this.result[this.result.length-1];if(!this.createFrictionEquationsFromContact(e,this.frictionResult)||t===1)return;const n=this.frictionResult[this.frictionResult.length-2],i=this.frictionResult[this.frictionResult.length-1];li.setZero(),Ui.setZero(),Fi.setZero();const s=e.bi;e.bj;for(let a=0;a!==t;a++)e=this.result[this.result.length-1-a],e.bi!==s?(li.vadd(e.ni,li),Ui.vadd(e.ri,Ui),Fi.vadd(e.rj,Fi)):(li.vsub(e.ni,li),Ui.vadd(e.rj,Ui),Fi.vadd(e.ri,Fi));const o=1/t;Ui.scale(o,n.ri),Fi.scale(o,n.rj),i.ri.copy(n.ri),i.rj.copy(n.rj),li.normalize(),li.tangents(n.t,i.t)}getContacts(t,e,n,i,s,o,a){this.contactPointPool=s,this.frictionEquationPool=a,this.result=i,this.frictionResult=o;const l=Cv,c=Pv,h=Av,d=Rv;for(let u=0,p=t.length;u!==p;u++){const g=t[u],_=e[u];let m=null;g.material&&_.material&&(m=n.getContactMaterial(g.material,_.material)||null);const f=g.type&gt.KINEMATIC&&_.type&gt.STATIC||g.type&gt.STATIC&&_.type&gt.KINEMATIC||g.type&gt.KINEMATIC&&_.type&gt.KINEMATIC;for(let v=0;v<g.shapes.length;v++){g.quaternion.mult(g.shapeOrientations[v],l),g.quaternion.vmult(g.shapeOffsets[v],h),h.vadd(g.position,h);const S=g.shapes[v];for(let x=0;x<_.shapes.length;x++){_.quaternion.mult(_.shapeOrientations[x],c),_.quaternion.vmult(_.shapeOffsets[x],d),d.vadd(_.position,d);const w=_.shapes[x];if(!(S.collisionFilterMask&w.collisionFilterGroup&&w.collisionFilterMask&S.collisionFilterGroup)||h.distanceTo(d)>S.boundingSphereRadius+w.boundingSphereRadius)continue;let A=null;S.material&&w.material&&(A=n.getContactMaterial(S.material,w.material)||null),this.currentContactMaterial=A||m||n.defaultContactMaterial;const R=S.type|w.type,L=this[R];if(L){let b=!1;S.type<w.type?b=L.call(this,S,w,h,d,l,c,g,_,S,w,f):b=L.call(this,w,S,d,h,c,l,_,g,S,w,f),b&&f&&(n.shapeOverlapKeeper.set(S.id,w.id),n.bodyOverlapKeeper.set(g.id,_.id))}}}}}sphereSphere(t,e,n,i,s,o,a,l,c,h,d){if(d)return n.distanceSquared(i)<(t.radius+e.radius)**2;const u=this.createContactEquation(a,l,t,e,c,h);i.vsub(n,u.ni),u.ni.normalize(),u.ri.copy(u.ni),u.rj.copy(u.ni),u.ri.scale(t.radius,u.ri),u.rj.scale(-e.radius,u.rj),u.ri.vadd(n,u.ri),u.ri.vsub(a.position,u.ri),u.rj.vadd(i,u.rj),u.rj.vsub(l.position,u.rj),this.result.push(u),this.createFrictionEquationsFromContact(u,this.frictionResult)}spherePlane(t,e,n,i,s,o,a,l,c,h,d){const u=this.createContactEquation(a,l,t,e,c,h);if(u.ni.set(0,0,1),o.vmult(u.ni,u.ni),u.ni.negate(u.ni),u.ni.normalize(),u.ni.scale(t.radius,u.ri),n.vsub(i,rr),u.ni.scale(u.ni.dot(rr),hl),rr.vsub(hl,u.rj),-rr.dot(u.ni)<=t.radius){if(d)return!0;const p=u.ri,g=u.rj;p.vadd(n,p),p.vsub(a.position,p),g.vadd(i,g),g.vsub(l.position,g),this.result.push(u),this.createFrictionEquationsFromContact(u,this.frictionResult)}}boxBox(t,e,n,i,s,o,a,l,c,h,d){return t.convexPolyhedronRepresentation.material=t.material,e.convexPolyhedronRepresentation.material=e.material,t.convexPolyhedronRepresentation.collisionResponse=t.collisionResponse,e.convexPolyhedronRepresentation.collisionResponse=e.collisionResponse,this.convexConvex(t.convexPolyhedronRepresentation,e.convexPolyhedronRepresentation,n,i,s,o,a,l,t,e,d)}sphereBox(t,e,n,i,s,o,a,l,c,h,d){const u=this.v3pool,p=n0;n.vsub(i,or),e.getSideNormals(p,o);const g=t.radius;let _=!1;const m=s0,f=r0,v=o0;let S=null,x=0,w=0,A=0,R=null;for(let N=0,$=p.length;N!==$&&_===!1;N++){const k=Qv;k.copy(p[N]);const K=k.length();k.normalize();const ot=or.dot(k);if(ot<K+g&&ot>0){const pt=t0,st=e0;pt.copy(p[(N+1)%3]),st.copy(p[(N+2)%3]);const $t=pt.length(),Xt=st.length();pt.normalize(),st.normalize();const Z=or.dot(pt),lt=or.dot(st);if(Z<$t&&Z>-$t&&lt<Xt&&lt>-Xt){const rt=Math.abs(ot-K-g);if((R===null||rt<R)&&(R=rt,w=Z,A=lt,S=K,m.copy(k),f.copy(pt),v.copy(st),x++,d))return!0}}}if(x){_=!0;const N=this.createContactEquation(a,l,t,e,c,h);m.scale(-g,N.ri),N.ni.copy(m),N.ni.negate(N.ni),m.scale(S,m),f.scale(w,f),m.vadd(f,m),v.scale(A,v),m.vadd(v,N.rj),N.ri.vadd(n,N.ri),N.ri.vsub(a.position,N.ri),N.rj.vadd(i,N.rj),N.rj.vsub(l.position,N.rj),this.result.push(N),this.createFrictionEquationsFromContact(N,this.frictionResult)}let L=u.get();const b=i0;for(let N=0;N!==2&&!_;N++)for(let $=0;$!==2&&!_;$++)for(let k=0;k!==2&&!_;k++)if(L.set(0,0,0),N?L.vadd(p[0],L):L.vsub(p[0],L),$?L.vadd(p[1],L):L.vsub(p[1],L),k?L.vadd(p[2],L):L.vsub(p[2],L),i.vadd(L,b),b.vsub(n,b),b.lengthSquared()<g*g){if(d)return!0;_=!0;const K=this.createContactEquation(a,l,t,e,c,h);K.ri.copy(b),K.ri.normalize(),K.ni.copy(K.ri),K.ri.scale(g,K.ri),K.rj.copy(L),K.ri.vadd(n,K.ri),K.ri.vsub(a.position,K.ri),K.rj.vadd(i,K.rj),K.rj.vsub(l.position,K.rj),this.result.push(K),this.createFrictionEquationsFromContact(K,this.frictionResult)}u.release(L),L=null;const E=u.get(),P=u.get(),H=u.get(),I=u.get(),F=u.get(),O=p.length;for(let N=0;N!==O&&!_;N++)for(let $=0;$!==O&&!_;$++)if(N%3!==$%3){p[$].cross(p[N],E),E.normalize(),p[N].vadd(p[$],P),H.copy(n),H.vsub(P,H),H.vsub(i,H);const k=H.dot(E);E.scale(k,I);let K=0;for(;K===N%3||K===$%3;)K++;F.copy(n),F.vsub(I,F),F.vsub(P,F),F.vsub(i,F);const ot=Math.abs(k),pt=F.length();if(ot<p[K].length()&&pt<g){if(d)return!0;_=!0;const st=this.createContactEquation(a,l,t,e,c,h);P.vadd(I,st.rj),st.rj.copy(st.rj),F.negate(st.ni),st.ni.normalize(),st.ri.copy(st.rj),st.ri.vadd(i,st.ri),st.ri.vsub(n,st.ri),st.ri.normalize(),st.ri.scale(g,st.ri),st.ri.vadd(n,st.ri),st.ri.vsub(a.position,st.ri),st.rj.vadd(i,st.rj),st.rj.vsub(l.position,st.rj),this.result.push(st),this.createFrictionEquationsFromContact(st,this.frictionResult)}}u.release(E,P,H,I,F)}planeBox(t,e,n,i,s,o,a,l,c,h,d){return e.convexPolyhedronRepresentation.material=e.material,e.convexPolyhedronRepresentation.collisionResponse=e.collisionResponse,e.convexPolyhedronRepresentation.id=e.id,this.planeConvex(t,e.convexPolyhedronRepresentation,n,i,s,o,a,l,t,e,d)}convexConvex(t,e,n,i,s,o,a,l,c,h,d,u,p){const g=M0;if(!(n.distanceTo(i)>t.boundingSphereRadius+e.boundingSphereRadius)&&t.findSeparatingAxis(e,n,s,i,o,g,u,p)){const _=[],m=S0;t.clipAgainstHull(n,s,e,i,o,g,-100,100,_);let f=0;for(let v=0;v!==_.length;v++){if(d)return!0;const S=this.createContactEquation(a,l,t,e,c,h),x=S.ri,w=S.rj;g.negate(S.ni),_[v].normal.negate(m),m.scale(_[v].depth,m),_[v].point.vadd(m,x),w.copy(_[v].point),x.vsub(n,x),w.vsub(i,w),x.vadd(n,x),x.vsub(a.position,x),w.vadd(i,w),w.vsub(l.position,w),this.result.push(S),f++,this.enableFrictionReduction||this.createFrictionEquationsFromContact(S,this.frictionResult)}this.enableFrictionReduction&&f&&this.createFrictionFromAverage(f)}}sphereConvex(t,e,n,i,s,o,a,l,c,h,d){const u=this.v3pool;n.vsub(i,a0);const p=e.faceNormals,g=e.faces,_=e.vertices,m=t.radius;let f=!1;for(let v=0;v!==_.length;v++){const S=_[v],x=u0;o.vmult(S,x),i.vadd(x,x);const w=h0;if(x.vsub(n,w),w.lengthSquared()<m*m){if(d)return!0;f=!0;const A=this.createContactEquation(a,l,t,e,c,h);A.ri.copy(w),A.ri.normalize(),A.ni.copy(A.ri),A.ri.scale(m,A.ri),x.vsub(i,A.rj),A.ri.vadd(n,A.ri),A.ri.vsub(a.position,A.ri),A.rj.vadd(i,A.rj),A.rj.vsub(l.position,A.rj),this.result.push(A),this.createFrictionEquationsFromContact(A,this.frictionResult);return}}for(let v=0,S=g.length;v!==S&&f===!1;v++){const x=p[v],w=g[v],A=d0;o.vmult(x,A);const R=f0;o.vmult(_[w[0]],R),R.vadd(i,R);const L=p0;A.scale(-m,L),n.vadd(L,L);const b=m0;L.vsub(R,b);const E=b.dot(A),P=g0;if(n.vsub(R,P),E<0&&P.dot(A)>0){const H=[];for(let I=0,F=w.length;I!==F;I++){const O=u.get();o.vmult(_[w[I]],O),i.vadd(O,O),H.push(O)}if(Jv(H,A,n)){if(d)return!0;f=!0;const I=this.createContactEquation(a,l,t,e,c,h);A.scale(-m,I.ri),A.negate(I.ni);const F=u.get();A.scale(-E,F);const O=u.get();A.scale(-m,O),n.vsub(i,I.rj),I.rj.vadd(O,I.rj),I.rj.vadd(F,I.rj),I.rj.vadd(i,I.rj),I.rj.vsub(l.position,I.rj),I.ri.vadd(n,I.ri),I.ri.vsub(a.position,I.ri),u.release(F),u.release(O),this.result.push(I),this.createFrictionEquationsFromContact(I,this.frictionResult);for(let N=0,$=H.length;N!==$;N++)u.release(H[N]);return}else for(let I=0;I!==w.length;I++){const F=u.get(),O=u.get();o.vmult(_[w[(I+1)%w.length]],F),o.vmult(_[w[(I+2)%w.length]],O),i.vadd(F,F),i.vadd(O,O);const N=c0;O.vsub(F,N);const $=l0;N.unit($);const k=u.get(),K=u.get();n.vsub(F,K);const ot=K.dot($);$.scale(ot,k),k.vadd(F,k);const pt=u.get();if(k.vsub(n,pt),ot>0&&ot*ot<N.lengthSquared()&&pt.lengthSquared()<m*m){if(d)return!0;const st=this.createContactEquation(a,l,t,e,c,h);k.vsub(i,st.rj),k.vsub(n,st.ni),st.ni.normalize(),st.ni.scale(m,st.ri),st.rj.vadd(i,st.rj),st.rj.vsub(l.position,st.rj),st.ri.vadd(n,st.ri),st.ri.vsub(a.position,st.ri),this.result.push(st),this.createFrictionEquationsFromContact(st,this.frictionResult);for(let $t=0,Xt=H.length;$t!==Xt;$t++)u.release(H[$t]);u.release(F),u.release(O),u.release(k),u.release(pt),u.release(K);return}u.release(F),u.release(O),u.release(k),u.release(pt),u.release(K)}for(let I=0,F=H.length;I!==F;I++)u.release(H[I])}}}planeConvex(t,e,n,i,s,o,a,l,c,h,d){const u=_0,p=v0;p.set(0,0,1),s.vmult(p,p);let g=0;const _=x0;for(let m=0;m!==e.vertices.length;m++)if(u.copy(e.vertices[m]),o.vmult(u,u),i.vadd(u,u),u.vsub(n,_),p.dot(_)<=0){if(d)return!0;const v=this.createContactEquation(a,l,t,e,c,h),S=y0;p.scale(p.dot(_),S),u.vsub(S,S),S.vsub(n,v.ri),v.ni.copy(p),u.vsub(i,v.rj),v.ri.vadd(n,v.ri),v.ri.vsub(a.position,v.ri),v.rj.vadd(i,v.rj),v.rj.vsub(l.position,v.rj),this.result.push(v),g++,this.enableFrictionReduction||this.createFrictionEquationsFromContact(v,this.frictionResult)}this.enableFrictionReduction&&g&&this.createFrictionFromAverage(g)}boxConvex(t,e,n,i,s,o,a,l,c,h,d){return t.convexPolyhedronRepresentation.material=t.material,t.convexPolyhedronRepresentation.collisionResponse=t.collisionResponse,this.convexConvex(t.convexPolyhedronRepresentation,e,n,i,s,o,a,l,t,e,d)}sphereHeightfield(t,e,n,i,s,o,a,l,c,h,d){const u=e.data,p=t.radius,g=e.elementSize,_=N0,m=D0;jt.pointToLocalFrame(i,o,n,m);let f=Math.floor((m.x-p)/g)-1,v=Math.ceil((m.x+p)/g)+1,S=Math.floor((m.y-p)/g)-1,x=Math.ceil((m.y+p)/g)+1;if(v<0||x<0||f>u.length||S>u[0].length)return;f<0&&(f=0),v<0&&(v=0),S<0&&(S=0),x<0&&(x=0),f>=u.length&&(f=u.length-1),v>=u.length&&(v=u.length-1),x>=u[0].length&&(x=u[0].length-1),S>=u[0].length&&(S=u[0].length-1);const w=[];e.getRectMinMax(f,S,v,x,w);const A=w[0],R=w[1];if(m.z-p>R||m.z+p<A)return;const L=this.result;for(let b=f;b<v;b++)for(let E=S;E<x;E++){const P=L.length;let H=!1;if(e.getConvexTrianglePillar(b,E,!1),jt.pointToWorldFrame(i,o,e.pillarOffset,_),n.distanceTo(_)<e.pillarConvex.boundingSphereRadius+t.boundingSphereRadius&&(H=this.sphereConvex(t,e.pillarConvex,n,_,s,o,a,l,t,e,d)),d&&H||(e.getConvexTrianglePillar(b,E,!0),jt.pointToWorldFrame(i,o,e.pillarOffset,_),n.distanceTo(_)<e.pillarConvex.boundingSphereRadius+t.boundingSphereRadius&&(H=this.sphereConvex(t,e.pillarConvex,n,_,s,o,a,l,t,e,d)),d&&H))return!0;if(L.length-P>2)return}}boxHeightfield(t,e,n,i,s,o,a,l,c,h,d){return t.convexPolyhedronRepresentation.material=t.material,t.convexPolyhedronRepresentation.collisionResponse=t.collisionResponse,this.convexHeightfield(t.convexPolyhedronRepresentation,e,n,i,s,o,a,l,t,e,d)}convexHeightfield(t,e,n,i,s,o,a,l,c,h,d){const u=e.data,p=e.elementSize,g=t.boundingSphereRadius,_=I0,m=L0,f=P0;jt.pointToLocalFrame(i,o,n,f);let v=Math.floor((f.x-g)/p)-1,S=Math.ceil((f.x+g)/p)+1,x=Math.floor((f.y-g)/p)-1,w=Math.ceil((f.y+g)/p)+1;if(S<0||w<0||v>u.length||x>u[0].length)return;v<0&&(v=0),S<0&&(S=0),x<0&&(x=0),w<0&&(w=0),v>=u.length&&(v=u.length-1),S>=u.length&&(S=u.length-1),w>=u[0].length&&(w=u[0].length-1),x>=u[0].length&&(x=u[0].length-1);const A=[];e.getRectMinMax(v,x,S,w,A);const R=A[0],L=A[1];if(!(f.z-g>L||f.z+g<R))for(let b=v;b<S;b++)for(let E=x;E<w;E++){let P=!1;if(e.getConvexTrianglePillar(b,E,!1),jt.pointToWorldFrame(i,o,e.pillarOffset,_),n.distanceTo(_)<e.pillarConvex.boundingSphereRadius+t.boundingSphereRadius&&(P=this.convexConvex(t,e.pillarConvex,n,_,s,o,a,l,null,null,d,m,null)),d&&P||(e.getConvexTrianglePillar(b,E,!0),jt.pointToWorldFrame(i,o,e.pillarOffset,_),n.distanceTo(_)<e.pillarConvex.boundingSphereRadius+t.boundingSphereRadius&&(P=this.convexConvex(t,e.pillarConvex,n,_,s,o,a,l,null,null,d,m,null)),d&&P))return!0}}sphereParticle(t,e,n,i,s,o,a,l,c,h,d){const u=w0;if(u.set(0,0,1),i.vsub(n,u),u.lengthSquared()<=t.radius*t.radius){if(d)return!0;const g=this.createContactEquation(l,a,e,t,c,h);u.normalize(),g.rj.copy(u),g.rj.scale(t.radius,g.rj),g.ni.copy(u),g.ni.negate(g.ni),g.ri.set(0,0,0),this.result.push(g),this.createFrictionEquationsFromContact(g,this.frictionResult)}}planeParticle(t,e,n,i,s,o,a,l,c,h,d){const u=E0;u.set(0,0,1),a.quaternion.vmult(u,u);const p=T0;if(i.vsub(a.position,p),u.dot(p)<=0){if(d)return!0;const _=this.createContactEquation(l,a,e,t,c,h);_.ni.copy(u),_.ni.negate(_.ni),_.ri.set(0,0,0);const m=b0;u.scale(u.dot(i),m),i.vsub(m,m),_.rj.copy(m),this.result.push(_),this.createFrictionEquationsFromContact(_,this.frictionResult)}}boxParticle(t,e,n,i,s,o,a,l,c,h,d){return t.convexPolyhedronRepresentation.material=t.material,t.convexPolyhedronRepresentation.collisionResponse=t.collisionResponse,this.convexParticle(t.convexPolyhedronRepresentation,e,n,i,s,o,a,l,t,e,d)}convexParticle(t,e,n,i,s,o,a,l,c,h,d){let u=-1;const p=R0,g=C0;let _=null;const m=A0;if(m.copy(i),m.vsub(n,m),s.conjugate(ul),ul.vmult(m,m),t.pointIsInside(m)){t.worldVerticesNeedsUpdate&&t.computeWorldVertices(n,s),t.worldFaceNormalsNeedsUpdate&&t.computeWorldFaceNormals(s);for(let f=0,v=t.faces.length;f!==v;f++){const S=[t.worldVertices[t.faces[f][0]]],x=t.worldFaceNormals[f];i.vsub(S[0],dl);const w=-x.dot(dl);if(_===null||Math.abs(w)<Math.abs(_)){if(d)return!0;_=w,u=f,p.copy(x)}}if(u!==-1){const f=this.createContactEquation(l,a,e,t,c,h);p.scale(_,g),g.vadd(i,g),g.vsub(n,g),f.rj.copy(g),p.negate(f.ni),f.ri.set(0,0,0);const v=f.ri,S=f.rj;v.vadd(i,v),v.vsub(l.position,v),S.vadd(n,S),S.vsub(a.position,S),this.result.push(f),this.createFrictionEquationsFromContact(f,this.frictionResult)}else console.warn("Point found inside convex, but did not find penetrating face!")}}heightfieldCylinder(t,e,n,i,s,o,a,l,c,h,d){return this.convexHeightfield(e,t,i,n,o,s,l,a,c,h,d)}particleCylinder(t,e,n,i,s,o,a,l,c,h,d){return this.convexParticle(e,t,i,n,o,s,l,a,c,h,d)}sphereTrimesh(t,e,n,i,s,o,a,l,c,h,d){const u=zv,p=Bv,g=kv,_=Vv,m=Gv,f=Hv,v=Yv,S=Ov,x=Uv,w=$v;jt.pointToLocalFrame(i,o,n,m);const A=t.radius;v.lowerBound.set(m.x-A,m.y-A,m.z-A),v.upperBound.set(m.x+A,m.y+A,m.z+A),e.getTrianglesInAABB(v,w);const R=Fv,L=t.radius*t.radius;for(let I=0;I<w.length;I++)for(let F=0;F<3;F++)if(e.getVertex(e.indices[w[I]*3+F],R),R.vsub(m,x),x.lengthSquared()<=L){if(S.copy(R),jt.pointToWorldFrame(i,o,S,R),R.vsub(n,x),d)return!0;let O=this.createContactEquation(a,l,t,e,c,h);O.ni.copy(x),O.ni.normalize(),O.ri.copy(O.ni),O.ri.scale(t.radius,O.ri),O.ri.vadd(n,O.ri),O.ri.vsub(a.position,O.ri),O.rj.copy(R),O.rj.vsub(l.position,O.rj),this.result.push(O),this.createFrictionEquationsFromContact(O,this.frictionResult)}for(let I=0;I<w.length;I++)for(let F=0;F<3;F++){e.getVertex(e.indices[w[I]*3+F],u),e.getVertex(e.indices[w[I]*3+(F+1)%3],p),p.vsub(u,g),m.vsub(p,f);const O=f.dot(g);m.vsub(u,f);let N=f.dot(g);if(N>0&&O<0&&(m.vsub(u,f),_.copy(g),_.normalize(),N=f.dot(_),_.scale(N,f),f.vadd(u,f),f.distanceTo(m)<t.radius)){if(d)return!0;const k=this.createContactEquation(a,l,t,e,c,h);f.vsub(m,k.ni),k.ni.normalize(),k.ni.scale(t.radius,k.ri),k.ri.vadd(n,k.ri),k.ri.vsub(a.position,k.ri),jt.pointToWorldFrame(i,o,f,f),f.vsub(l.position,k.rj),jt.vectorToWorldFrame(o,k.ni,k.ni),jt.vectorToWorldFrame(o,k.ri,k.ri),this.result.push(k),this.createFrictionEquationsFromContact(k,this.frictionResult)}}const b=Wv,E=Xv,P=qv,H=Nv;for(let I=0,F=w.length;I!==F;I++){e.getTriangleVertices(w[I],b,E,P),e.getNormal(w[I],H),m.vsub(b,f);let O=f.dot(H);if(H.scale(O,f),m.vsub(f,f),O=f.distanceTo(m),_e.pointInTriangle(f,b,E,P)&&O<t.radius){if(d)return!0;let N=this.createContactEquation(a,l,t,e,c,h);f.vsub(m,N.ni),N.ni.normalize(),N.ni.scale(t.radius,N.ri),N.ri.vadd(n,N.ri),N.ri.vsub(a.position,N.ri),jt.pointToWorldFrame(i,o,f,f),f.vsub(l.position,N.rj),jt.vectorToWorldFrame(o,N.ni,N.ni),jt.vectorToWorldFrame(o,N.ri,N.ri),this.result.push(N),this.createFrictionEquationsFromContact(N,this.frictionResult)}}w.length=0}planeTrimesh(t,e,n,i,s,o,a,l,c,h,d){const u=new M,p=Iv;p.set(0,0,1),s.vmult(p,p);for(let g=0;g<e.vertices.length/3;g++){e.getVertex(g,u);const _=new M;_.copy(u),jt.pointToWorldFrame(i,o,_,u);const m=Lv;if(u.vsub(n,m),p.dot(m)<=0){if(d)return!0;const v=this.createContactEquation(a,l,t,e,c,h);v.ni.copy(p);const S=Dv;p.scale(m.dot(p),S),u.vsub(S,S),v.ri.copy(S),v.ri.vsub(a.position,v.ri),v.rj.copy(u),v.rj.vsub(l.position,v.rj),this.result.push(v),this.createFrictionEquationsFromContact(v,this.frictionResult)}}}}const li=new M,Ui=new M,Fi=new M,Av=new M,Rv=new M,Cv=new ve,Pv=new ve,Iv=new M,Lv=new M,Dv=new M,Nv=new M,Uv=new M;new M;const Fv=new M,Ov=new M,zv=new M,Bv=new M,kv=new M,Vv=new M,Gv=new M,Hv=new M,Wv=new M,Xv=new M,qv=new M,Yv=new Ke,$v=[],rr=new M,hl=new M,Zv=new M,jv=new M,Kv=new M;function Jv(r,t,e){let n=null;const i=r.length;for(let s=0;s!==i;s++){const o=r[s],a=Zv;r[(s+1)%i].vsub(o,a);const l=jv;a.cross(t,l);const c=Kv;e.vsub(o,c);const h=l.dot(c);if(n===null||h>0&&n===!0||h<=0&&n===!1){n===null&&(n=h>0);continue}else return!1}return!0}const or=new M,Qv=new M,t0=new M,e0=new M,n0=[new M,new M,new M,new M,new M,new M],i0=new M,s0=new M,r0=new M,o0=new M,a0=new M,c0=new M,l0=new M,h0=new M,u0=new M,d0=new M,f0=new M,p0=new M,m0=new M,g0=new M;new M;new M;const _0=new M,v0=new M,x0=new M,y0=new M,M0=new M,S0=new M,E0=new M,T0=new M,b0=new M,w0=new M,ul=new ve,A0=new M;new M;const R0=new M,dl=new M,C0=new M,P0=new M,I0=new M,L0=[0],D0=new M,N0=new M;class fl{constructor(){this.current=[],this.previous=[]}getKey(t,e){if(e<t){const n=e;e=t,t=n}return t<<16|e}set(t,e){const n=this.getKey(t,e),i=this.current;let s=0;for(;n>i[s];)s++;if(n!==i[s]){for(let o=i.length-1;o>=s;o--)i[o+1]=i[o];i[s]=n}}tick(){const t=this.current;this.current=this.previous,this.previous=t,this.current.length=0}getDiff(t,e){const n=this.current,i=this.previous,s=n.length,o=i.length;let a=0;for(let l=0;l<s;l++){let c=!1;const h=n[l];for(;h>i[a];)a++;c=h===i[a],c||pl(t,h)}a=0;for(let l=0;l<o;l++){let c=!1;const h=i[l];for(;h>n[a];)a++;c=n[a]===h,c||pl(e,h)}}}function pl(r,t){r.push((t&4294901760)>>16,t&65535)}const go=(r,t)=>r<t?`${r}-${t}`:`${t}-${r}`;class U0{constructor(){this.data={keys:[]}}get(t,e){const n=go(t,e);return this.data[n]}set(t,e,n){const i=go(t,e);this.get(t,e)||this.data.keys.push(i),this.data[i]=n}delete(t,e){const n=go(t,e),i=this.data.keys.indexOf(n);i!==-1&&this.data.keys.splice(i,1),delete this.data[n]}reset(){const t=this.data,e=t.keys;for(;e.length>0;){const n=e.pop();delete t[n]}}}class F0 extends _h{constructor(t){t===void 0&&(t={}),super(),this.dt=-1,this.allowSleep=!!t.allowSleep,this.contacts=[],this.frictionEquations=[],this.quatNormalizeSkip=t.quatNormalizeSkip!==void 0?t.quatNormalizeSkip:0,this.quatNormalizeFast=t.quatNormalizeFast!==void 0?t.quatNormalizeFast:!1,this.time=0,this.stepnumber=0,this.default_dt=1/60,this.nextId=0,this.gravity=new M,t.gravity&&this.gravity.copy(t.gravity),t.frictionGravity&&(this.frictionGravity=new M,this.frictionGravity.copy(t.frictionGravity)),this.broadphase=t.broadphase!==void 0?t.broadphase:new G_,this.bodies=[],this.hasActiveBodies=!1,this.solver=t.solver!==void 0?t.solver:new yv,this.constraints=[],this.narrowphase=new wv(this),this.collisionMatrix=new Qc,this.collisionMatrixPrevious=new Qc,this.bodyOverlapKeeper=new fl,this.shapeOverlapKeeper=new fl,this.contactmaterials=[],this.contactMaterialTable=new U0,this.defaultMaterial=new Zi("default"),this.defaultContactMaterial=new ws(this.defaultMaterial,this.defaultMaterial,{friction:.3,restitution:0}),this.doProfiling=!1,this.profile={solve:0,makeContactConstraints:0,broadphase:0,integrate:0,narrowphase:0},this.accumulator=0,this.subsystems=[],this.addBodyEvent={type:"addBody",body:null},this.removeBodyEvent={type:"removeBody",body:null},this.idToBodyMap={},this.broadphase.setWorld(this)}getContactMaterial(t,e){return this.contactMaterialTable.get(t.id,e.id)}collisionMatrixTick(){const t=this.collisionMatrixPrevious;this.collisionMatrixPrevious=this.collisionMatrix,this.collisionMatrix=t,this.collisionMatrix.reset(),this.bodyOverlapKeeper.tick(),this.shapeOverlapKeeper.tick()}addConstraint(t){this.constraints.push(t)}removeConstraint(t){const e=this.constraints.indexOf(t);e!==-1&&this.constraints.splice(e,1)}rayTest(t,e,n){n instanceof Sr?this.raycastClosest(t,e,{skipBackfaces:!0},n):this.raycastAll(t,e,{skipBackfaces:!0},n)}raycastAll(t,e,n,i){return n===void 0&&(n={}),n.mode=_e.ALL,n.from=t,n.to=e,n.callback=i,_o.intersectWorld(this,n)}raycastAny(t,e,n,i){return n===void 0&&(n={}),n.mode=_e.ANY,n.from=t,n.to=e,n.result=i,_o.intersectWorld(this,n)}raycastClosest(t,e,n,i){return n===void 0&&(n={}),n.mode=_e.CLOSEST,n.from=t,n.to=e,n.result=i,_o.intersectWorld(this,n)}addBody(t){this.bodies.includes(t)||(t.index=this.bodies.length,this.bodies.push(t),t.world=this,t.initPosition.copy(t.position),t.initVelocity.copy(t.velocity),t.timeLastSleepy=this.time,t instanceof gt&&(t.initAngularVelocity.copy(t.angularVelocity),t.initQuaternion.copy(t.quaternion)),this.collisionMatrix.setNumObjects(this.bodies.length),this.addBodyEvent.body=t,this.idToBodyMap[t.id]=t,this.dispatchEvent(this.addBodyEvent))}removeBody(t){t.world=null;const e=this.bodies.length-1,n=this.bodies,i=n.indexOf(t);if(i!==-1){n.splice(i,1);for(let s=0;s!==n.length;s++)n[s].index=s;this.collisionMatrix.setNumObjects(e),this.removeBodyEvent.body=t,delete this.idToBodyMap[t.id],this.dispatchEvent(this.removeBodyEvent)}}getBodyById(t){return this.idToBodyMap[t]}getShapeById(t){const e=this.bodies;for(let n=0;n<e.length;n++){const i=e[n].shapes;for(let s=0;s<i.length;s++){const o=i[s];if(o.id===t)return o}}return null}addContactMaterial(t){this.contactmaterials.push(t),this.contactMaterialTable.set(t.materials[0].id,t.materials[1].id,t)}removeContactMaterial(t){const e=this.contactmaterials.indexOf(t);e!==-1&&(this.contactmaterials.splice(e,1),this.contactMaterialTable.delete(t.materials[0].id,t.materials[1].id))}fixedStep(t,e){t===void 0&&(t=1/60),e===void 0&&(e=10);const n=xe.now()/1e3;if(!this.lastCallTime)this.step(t,void 0,e);else{const i=n-this.lastCallTime;this.step(t,i,e)}this.lastCallTime=n}step(t,e,n){if(n===void 0&&(n=10),e===void 0)this.internalStep(t),this.time+=t;else{this.accumulator+=e;const i=xe.now();let s=0;for(;this.accumulator>=t&&s<n&&(this.internalStep(t),this.accumulator-=t,s++,!(xe.now()-i>t*1e3)););this.accumulator=this.accumulator%t;const o=this.accumulator/t;for(let a=0;a!==this.bodies.length;a++){const l=this.bodies[a];l.previousPosition.lerp(l.position,o,l.interpolatedPosition),l.previousQuaternion.slerp(l.quaternion,o,l.interpolatedQuaternion),l.previousQuaternion.normalize()}this.time+=e}}internalStep(t){this.dt=t;const e=this.contacts,n=V0,i=G0,s=this.bodies.length,o=this.bodies,a=this.solver,l=this.gravity,c=this.doProfiling,h=this.profile,d=gt.DYNAMIC;let u=-1/0;const p=this.constraints,g=k0;l.length();const _=l.x,m=l.y,f=l.z;let v=0;for(c&&(u=xe.now()),v=0;v!==s;v++){const I=o[v];if(I.type===d){const F=I.force,O=I.mass;F.x+=O*_,F.y+=O*m,F.z+=O*f}}for(let I=0,F=this.subsystems.length;I!==F;I++)this.subsystems[I].update();c&&(u=xe.now()),n.length=0,i.length=0,this.broadphase.collisionPairs(this,n,i),c&&(h.broadphase=xe.now()-u);let S=p.length;for(v=0;v!==S;v++){const I=p[v];if(!I.collideConnected)for(let F=n.length-1;F>=0;F-=1)(I.bodyA===n[F]&&I.bodyB===i[F]||I.bodyB===n[F]&&I.bodyA===i[F])&&(n.splice(F,1),i.splice(F,1))}this.collisionMatrixTick(),c&&(u=xe.now());const x=B0,w=e.length;for(v=0;v!==w;v++)x.push(e[v]);e.length=0;const A=this.frictionEquations.length;for(v=0;v!==A;v++)g.push(this.frictionEquations[v]);for(this.frictionEquations.length=0,this.narrowphase.getContacts(n,i,this,e,x,this.frictionEquations,g),c&&(h.narrowphase=xe.now()-u),c&&(u=xe.now()),v=0;v<this.frictionEquations.length;v++)a.addEquation(this.frictionEquations[v]);const R=e.length;for(let I=0;I!==R;I++){const F=e[I],O=F.bi,N=F.bj,$=F.si,k=F.sj;let K;if(O.material&&N.material?K=this.getContactMaterial(O.material,N.material)||this.defaultContactMaterial:K=this.defaultContactMaterial,K.friction,O.material&&N.material&&(O.material.friction>=0&&N.material.friction>=0&&O.material.friction*N.material.friction,O.material.restitution>=0&&N.material.restitution>=0&&(F.restitution=O.material.restitution*N.material.restitution)),a.addEquation(F),O.allowSleep&&O.type===gt.DYNAMIC&&O.sleepState===gt.SLEEPING&&N.sleepState===gt.AWAKE&&N.type!==gt.STATIC){const ot=N.velocity.lengthSquared()+N.angularVelocity.lengthSquared(),pt=N.sleepSpeedLimit**2;ot>=pt*2&&(O.wakeUpAfterNarrowphase=!0)}if(N.allowSleep&&N.type===gt.DYNAMIC&&N.sleepState===gt.SLEEPING&&O.sleepState===gt.AWAKE&&O.type!==gt.STATIC){const ot=O.velocity.lengthSquared()+O.angularVelocity.lengthSquared(),pt=O.sleepSpeedLimit**2;ot>=pt*2&&(N.wakeUpAfterNarrowphase=!0)}this.collisionMatrix.set(O,N,!0),this.collisionMatrixPrevious.get(O,N)||(cs.body=N,cs.contact=F,O.dispatchEvent(cs),cs.body=O,N.dispatchEvent(cs)),this.bodyOverlapKeeper.set(O.id,N.id),this.shapeOverlapKeeper.set($.id,k.id)}for(this.emitContactEvents(),c&&(h.makeContactConstraints=xe.now()-u,u=xe.now()),v=0;v!==s;v++){const I=o[v];I.wakeUpAfterNarrowphase&&(I.wakeUp(),I.wakeUpAfterNarrowphase=!1)}for(S=p.length,v=0;v!==S;v++){const I=p[v];I.update();for(let F=0,O=I.equations.length;F!==O;F++){const N=I.equations[F];a.addEquation(N)}}a.solve(t,this),c&&(h.solve=xe.now()-u),a.removeAllEquations();const L=Math.pow;for(v=0;v!==s;v++){const I=o[v];if(I.type&d){const F=L(1-I.linearDamping,t),O=I.velocity;O.scale(F,O);const N=I.angularVelocity;if(N){const $=L(1-I.angularDamping,t);N.scale($,N)}}}this.dispatchEvent(z0),c&&(u=xe.now());const E=this.stepnumber%(this.quatNormalizeSkip+1)===0,P=this.quatNormalizeFast;for(v=0;v!==s;v++)o[v].integrate(t,E,P);this.clearForces(),this.broadphase.dirty=!0,c&&(h.integrate=xe.now()-u),this.stepnumber+=1,this.dispatchEvent(O0);let H=!0;if(this.allowSleep)for(H=!1,v=0;v!==s;v++){const I=o[v];I.sleepTick(this.time),I.sleepState!==gt.SLEEPING&&(H=!0)}this.hasActiveBodies=H}emitContactEvents(){const t=this.hasAnyEventListener("beginContact"),e=this.hasAnyEventListener("endContact");if((t||e)&&this.bodyOverlapKeeper.getDiff(Dn,Nn),t){for(let s=0,o=Dn.length;s<o;s+=2)ls.bodyA=this.getBodyById(Dn[s]),ls.bodyB=this.getBodyById(Dn[s+1]),this.dispatchEvent(ls);ls.bodyA=ls.bodyB=null}if(e){for(let s=0,o=Nn.length;s<o;s+=2)hs.bodyA=this.getBodyById(Nn[s]),hs.bodyB=this.getBodyById(Nn[s+1]),this.dispatchEvent(hs);hs.bodyA=hs.bodyB=null}Dn.length=Nn.length=0;const n=this.hasAnyEventListener("beginShapeContact"),i=this.hasAnyEventListener("endShapeContact");if((n||i)&&this.shapeOverlapKeeper.getDiff(Dn,Nn),n){for(let s=0,o=Dn.length;s<o;s+=2){const a=this.getShapeById(Dn[s]),l=this.getShapeById(Dn[s+1]);Un.shapeA=a,Un.shapeB=l,a&&(Un.bodyA=a.body),l&&(Un.bodyB=l.body),this.dispatchEvent(Un)}Un.bodyA=Un.bodyB=Un.shapeA=Un.shapeB=null}if(i){for(let s=0,o=Nn.length;s<o;s+=2){const a=this.getShapeById(Nn[s]),l=this.getShapeById(Nn[s+1]);Fn.shapeA=a,Fn.shapeB=l,a&&(Fn.bodyA=a.body),l&&(Fn.bodyB=l.body),this.dispatchEvent(Fn)}Fn.bodyA=Fn.bodyB=Fn.shapeA=Fn.shapeB=null}}clearForces(){const t=this.bodies,e=t.length;for(let n=0;n!==e;n++){const i=t[n];i.force,i.torque,i.force.set(0,0,0),i.torque.set(0,0,0)}}}new Ke;const _o=new _e,xe=globalThis.performance||{};if(!xe.now){let r=Date.now();xe.timing&&xe.timing.navigationStart&&(r=xe.timing.navigationStart),xe.now=()=>Date.now()-r}new M;const O0={type:"postStep"},z0={type:"preStep"},cs={type:gt.COLLIDE_EVENT_NAME,body:null,contact:null},B0=[],k0=[],V0=[],G0=[],Dn=[],Nn=[],ls={type:"beginContact",bodyA:null,bodyB:null},hs={type:"endContact",bodyA:null,bodyB:null},Un={type:"beginShapeContact",bodyA:null,bodyB:null,shapeA:null,shapeB:null},Fn={type:"endShapeContact",bodyA:null,bodyB:null,shapeA:null,shapeB:null};function H0(r){const t=Math.hypot(r.x,r.y,r.z);return t<=1e-9?{x:0,y:0,z:0}:{x:r.x/t,y:r.y/t,z:r.z/t}}function vo(r,t){const e=r.motion;if(!e)return{pieceId:r.id,position:{...r.position},rotation:{...r.rotation},linearVelocity:{x:0,y:0,z:0}};const n=Math.max(.001,e.periodSeconds),i=Math.PI*2/n,s=i*Math.max(0,t)+(e.phaseRad??0),o=H0(e.axis),a=e.amplitude*Math.sin(s),l=e.amplitude*i*Math.cos(s);return{pieceId:r.id,position:{x:r.position.x+o.x*a,y:r.position.y+o.y*a,z:r.position.z+o.z*a},rotation:{...r.rotation},linearVelocity:{x:o.x*l,y:o.y*l,z:o.z*l}}}const ps=Math.PI/180,wh=.5,Ae=-wh/2;function q(r,t,e,n,i,s,o,a=0,l=0,c=0,h="track",d){return{id:r,section:t,position:{x:e,y:n,z:i},size:{x:s,y:wh,z:o},rotation:{x:a*ps,y:l*ps,z:c*ps},surface:h,motion:d}}const W0=[q("a-deck","calibration",0,Ae,-31.5,8.5,11),q("a-exit","calibration",-.2,Ae,-23.5,7.2,6.5,0,-5),q("b-s1","s-curve",-1.1,Ae,-18.4,6.6,6.6,0,-14),q("b-s2","s-curve",-2.6,Ae,-12.9,6.4,6.4,0,-14),q("b-s3","s-curve",-2.3,Ae,-7.5,6.2,6.4,0,8),q("b-s4","s-curve",-.5,Ae,-2.2,6,6.4,0,17),q("b-s5","s-curve",1.5,Ae,3,5.8,6.2,0,12),q("c-n1","narrow-rail",2.5,Ae,8.9,2.8,7.6),q("c-n2","narrow-rail",2.5,Ae,16,2.5,7.2),q("d-dip-in","momentum-gap",2.5,-.58,22,3.2,6.2,7),q("d-dip-floor","momentum-gap",2.5,-1.02,26.8,3.2,4.4),q("d-launch","momentum-gap",2.5,-.6,31.3,3.2,5.8,-11),q("d-landing","momentum-gap",2.5,Ae,38.4,3.8,5),q("e-b1","banked-turn",3.3,Ae,43.2,3.8,6,0,10,-6),q("e-b2","banked-turn",5.6,Ae,48.1,3.8,6,0,24,-10),q("e-b3","banked-turn",9,Ae,51.9,3.8,6,0,38,-12),q("e-b4","banked-turn",13.1,Ae,54.3,3.9,6,0,55,-10),q("e-b5","banked-turn",17.4,Ae,55.5,4.1,6,0,72,-6),q("f-brake","goal-brake",22,Ae,55.5,5.2,7.2,0,90),q("f-goal","goal-brake",28,Ae,55.5,6.2,7.2,0,90,0,"goal")],ml=[{id:"cp-start",section:"calibration",trigger:{x:0,y:0,z:-31.5},triggerRadius:3,pose:{position:{x:0,y:1.05,z:-31.5},cameraYawRad:0}},{id:"cp-s-exit",section:"narrow-rail",trigger:{x:2.3,y:0,z:5.7},triggerRadius:2.2,pose:{position:{x:2.5,y:1.05,z:6.2},cameraYawRad:0}},{id:"cp-narrow-exit",section:"momentum-gap",trigger:{x:2.5,y:0,z:18.6},triggerRadius:2,pose:{position:{x:2.5,y:1.05,z:19},cameraYawRad:0}},{id:"cp-gap-landing",section:"banked-turn",trigger:{x:2.5,y:0,z:39.4},triggerRadius:2,pose:{position:{x:2.5,y:1.05,z:39.4},cameraYawRad:0}},{id:"cp-bank-entry",section:"banked-turn",trigger:{x:4,y:0,z:44},triggerRadius:2,pose:{position:{x:3.6,y:1.05,z:43.7},cameraYawRad:12*ps}},{id:"cp-brake-entry",section:"goal-brake",trigger:{x:19.3,y:0,z:55.5},triggerRadius:2.2,pose:{position:{x:19.2,y:1.05,z:55.5},cameraYawRad:90*ps}}],Ia={pieces:W0,checkpoints:ml,start:ml[0].pose,goal:{center:{x:28.1,y:.6,z:55.5},halfExtents:{x:3.1,y:2.5,z:2.7},maxSpeed:1.25,holdSeconds:.75},bounds:{minX:-11,maxX:36,minY:-8,maxY:9,minZ:-40,maxZ:64}},X0={calibration:"CALIBRATION DECK","s-curve":"WIDE S-CURVE","narrow-rail":"NARROW RAIL","momentum-gap":"MOMENTUM DIP + GAP","banked-turn":"BANKED TURN","goal-brake":"GOAL BRAKE ZONE","magnetic-intro":"MAGNETIC ENTRY","magnetic-overhang":"MAGNETIC OVERHANG","magnetic-release":"MAGNETIC RELEASE","moving-intro":"MOVING RAIL APPROACH","moving-crossing":"MOVING RAIL CROSSING","moving-release":"MOVING RAIL EXIT","room-entry":"ROOM ENTRY","room-lower-route":"LOWER LOOP","room-lift":"MAGNETIC LIFT","room-upper-route":"UPPER RECEIVER","room-upper-crossing":"UPPER MOVING CROSSING","room-upper-return":"UPPER RETURN","room-goal":"GOAL OVERLOOK"},Ie={gravityMagnitude:9.81,fixedTimeStep:1/60,maxSubSteps:4,ballRadius:.65,ballMass:1.4,ballLinearDamping:.16,ballAngularDamping:.12,contactFriction:.48,contactRestitution:.08,safetySpeedLimit:22};function gl(r,t,e){return Math.min(e,Math.max(t,r))}function q0(r){return{...r,position:{...r.position},size:{...r.size},rotation:{...r.rotation},motion:r.motion?{...r.motion,axis:{...r.motion.axis}}:void 0}}const _l={active:!1,pieceId:null,strength:0,acceleration:{x:0,y:0,z:0},inwardNormal:null};class Y0{constructor(t=Ia){this.track=t,this.world=new F0({gravity:new M(0,-9.81,0)}),this.world.allowSleep=!0,this.world.broadphase=new Bi(this.world),this.contactMaterial=new ws(this.ballMaterial,this.trackMaterial,{friction:Ie.contactFriction,restitution:Ie.contactRestitution}),this.world.addContactMaterial(this.contactMaterial),this.world.defaultContactMaterial.friction=Ie.contactFriction,this.world.defaultContactMaterial.restitution=Ie.contactRestitution,this.createTrack(),this.ball=new gt({mass:Ie.ballMass,material:this.ballMaterial,shape:new vv(Ie.ballRadius),position:new M(this.track.start.position.x,this.track.start.position.y,this.track.start.position.z)}),this.ball.linearDamping=Ie.ballLinearDamping,this.ball.angularDamping=Ie.ballAngularDamping,this.ball.allowSleep=!1,this.world.addBody(this.ball),this.world.addEventListener("preStep",()=>{this.advanceMovingTrack(),this.applyMagneticRailForce()})}track;world;ball;trackMaterial=new Zi("track");ballMaterial=new Zi("ball");contactMaterial;movingTrackBodies=[];liveMagneticPieces=[];magneticState=_l;trackMotionTimeSeconds=0;setGravityDirection(t){const e=Ie.gravityMagnitude;this.world.gravity.set(t.x*e,t.y*e,t.z*e)}setVerticalGravity(){this.world.gravity.set(0,-9.81,0)}setBallLinearDamping(t){this.ball.linearDamping=Math.min(.99,Math.max(0,t))}setContactTuning(t,e){const n=gl(t,.15,.9),i=gl(e,0,.25);this.contactMaterial.friction=n,this.contactMaterial.restitution=i,this.world.defaultContactMaterial.friction=n,this.world.defaultContactMaterial.restitution=i}step(t){const e=Math.min(Math.max(t,0),.1);this.world.step(Ie.fixedTimeStep,e,Ie.maxSubSteps),this.applySafetySpeedLimit()}resetTrackMotion(){this.trackMotionTimeSeconds=0,this.syncMovingTrack(0)}getMovingTrackState(){return this.movingTrackBodies.map(({piece:t})=>vo(t,this.trackMotionTimeSeconds))}resetBall(t=this.track.start){this.ball.position.set(t.position.x,t.position.y,t.position.z),this.ball.velocity.set(0,0,0),this.ball.angularVelocity.set(0,0,0),this.ball.quaternion.set(0,0,0,1),this.ball.force.set(0,0,0),this.ball.torque.set(0,0,0),this.magneticState=_l,this.ball.wakeUp()}isOutOfBounds(){const{position:t}=this.ball,e=this.track.bounds;return t.x<e.minX||t.x>e.maxX||t.y<e.minY||t.y>e.maxY||t.z<e.minZ||t.z>e.maxZ}getBallState(){const{position:t,velocity:e,quaternion:n}=this.ball;return{position:{x:t.x,y:t.y,z:t.z},velocity:{x:e.x,y:e.y,z:e.z},quaternion:{x:n.x,y:n.y,z:n.z,w:n.w},speed:e.length(),grounded:this.world.contacts.some(i=>i.bi===this.ball||i.bj===this.ball),magnetic:{active:this.magneticState.active,pieceId:this.magneticState.pieceId,strength:this.magneticState.strength,acceleration:{...this.magneticState.acceleration},inwardNormal:this.magneticState.inwardNormal?{...this.magneticState.inwardNormal}:null}}}advanceMovingTrack(){this.movingTrackBodies.length!==0&&(this.trackMotionTimeSeconds+=Ie.fixedTimeStep,this.syncMovingTrack(this.trackMotionTimeSeconds))}syncMovingTrack(t){for(const{piece:e,body:n,liveMagneticPiece:i}of this.movingTrackBodies){const s=vo(e,t);n.position.set(s.position.x,s.position.y,s.position.z),n.velocity.set(s.linearVelocity.x,s.linearVelocity.y,s.linearVelocity.z),n.quaternion.setFromEuler(s.rotation.x,s.rotation.y,s.rotation.z,"XYZ"),n.angularVelocity.set(0,0,0),n.aabbNeedsUpdate=!0,n.wakeUp(),i&&(i.position.x=s.position.x,i.position.y=s.position.y,i.position.z=s.position.z,i.rotation.x=s.rotation.x,i.rotation.y=s.rotation.y,i.rotation.z=s.rotation.z)}}applyMagneticRailForce(){if(this.magneticState=g_({x:this.ball.position.x,y:this.ball.position.y,z:this.ball.position.z},Ie.ballRadius,this.liveMagneticPieces),!this.magneticState.active)return;const t=this.ball.mass;this.ball.force.x+=this.magneticState.acceleration.x*t,this.ball.force.y+=this.magneticState.acceleration.y*t,this.ball.force.z+=this.magneticState.acceleration.z*t}createTrack(){for(const t of this.track.pieces){const e=vo(t,0),n=t.surface==="magnetic"?q0(t):null;n&&this.liveMagneticPieces.push(n);const i=new gt({mass:0,material:this.trackMaterial,shape:new Rr(new M(t.size.x/2,t.size.y/2,t.size.z/2)),position:new M(e.position.x,e.position.y,e.position.z)});i.quaternion.setFromEuler(e.rotation.x,e.rotation.y,e.rotation.z,"XYZ"),t.motion&&(i.type=gt.KINEMATIC,i.velocity.set(e.linearVelocity.x,e.linearVelocity.y,e.linearVelocity.z),i.allowSleep=!1,i.updateMassProperties(),this.movingTrackBodies.push({piece:t,body:i,liveMagneticPiece:n})),this.world.addBody(i)}}applySafetySpeedLimit(){const t=this.ball.velocity.length();if(t<=Ie.safetySpeedLimit||t===0)return;const e=Ie.safetySpeedLimit/t;this.ball.velocity.x*=e,this.ball.velocity.y*=e,this.ball.velocity.z*=e}}class $0{constructor(t,e=Ia){this.root=t,this.track=e,this.renderer=new Jg({antialias:!0,powerPreference:"high-performance"}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),this.renderer.outputColorSpace=je,this.renderer.domElement.className="game-canvas",this.root.appendChild(this.renderer.domElement),this.scene.background=new Ht(462869),this.scene.fog=new Ea(462869,30,88),this.reducedMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches,this.addLighting(),this.addTrackGeometry(),this.addCheckpointMarkers(),this.addGoalBeacon();const n=this.createInnerShell();this.shell=n.mesh,this.shellMaterial=n.material,this.scene.add(this.shell)}root;track;renderer;scene=new id;shell;shellMaterial;reducedMotion;movingMeshes=new Map;goalMaterial=new os({color:2643021,roughness:.38,metalness:.36,emissive:1523512,emissiveIntensity:.85});magneticMaterial=new os({color:2055270,roughness:.34,metalness:.5,emissive:757644,emissiveIntensity:1.35});movingMaterial=new os({color:5916450,roughness:.38,metalness:.54,emissive:12743448,emissiveIntensity:.92});magneticBandMaterial=new Oi({color:9435112,transparent:!0,opacity:.82,depthWrite:!1});movingBandMaterial=new Oi({color:16765322,transparent:!0,opacity:.86,depthWrite:!1});goalBeaconMaterial=new os({color:12118751,roughness:.3,metalness:.18,emissive:6014126,emissiveIntensity:1.5,transparent:!0,opacity:.84});checkpointMarkers=[];resize(t,e){this.renderer.setSize(t,e,!1)}setTrackProgress(t){const e=t.complete?3.2:.85+t.goalHoldProgress*1.8;this.goalMaterial.emissiveIntensity=e,this.goalBeaconMaterial.emissiveIntensity=t.complete?4.2:1.5+t.goalHoldProgress*2.2,this.goalBeaconMaterial.opacity=t.complete?1:.84;for(let n=0;n<this.checkpointMarkers.length;n+=1){const i=this.checkpointMarkers[n].material;i.opacity=n<=t.checkpointIndex?.62:.18}}render(t,e,n=[]){for(const i of n){const s=this.movingMeshes.get(i.pieceId);s&&(s.position.set(i.position.x,i.position.y,i.position.z),s.rotation.set(i.rotation.x,i.rotation.y,i.rotation.z))}this.shell.visible=!this.reducedMotion,this.shell.position.set(e.position.x,e.position.y,e.position.z),this.shell.quaternion.set(e.quaternion.x,e.quaternion.y,e.quaternion.z,e.quaternion.w),this.shellMaterial.opacity=.045+e.magnetic.strength*.075,this.renderer.render(this.scene,t)}destroy(){this.renderer.dispose(),this.renderer.domElement.remove()}addLighting(){const t=new ud(13494501,462869,1.35);this.scene.add(t);const e=new xc(15138808,2.25);e.position.set(-10,20,-12),this.scene.add(e);const n=new xc(6990260,.9);n.position.set(18,10,26),this.scene.add(n)}addTrackGeometry(){const t=new os({color:1520698,roughness:.62,metalness:.3,emissive:464665,emissiveIntensity:.42}),e=new us({color:9425605,transparent:!0,opacity:.34}),n=new us({color:10483692,transparent:!0,opacity:.78}),i=new us({color:16765322,transparent:!0,opacity:.82});for(const s of this.track.pieces){const o=s.surface==="goal"?this.goalMaterial:s.surface==="magnetic"?this.magneticMaterial:s.surface==="moving"?this.movingMaterial:t,a=this.createTrackPieceMesh(s,o),l=s.surface==="magnetic"?n:s.surface==="moving"?i:e,c=new ad(new cd(a.geometry),l);c.renderOrder=1,a.add(c),s.surface==="magnetic"&&this.addMagneticBands(a,s),s.motion&&this.addMovingBands(a,s),s.motion&&(this.movingMeshes.set(s.id,a),this.addMovingPathGuide(s)),this.scene.add(a)}}addMagneticBands(t,e){const n=new Vn(e.size.x*.055,.025,e.size.z*.86);for(const i of[-.26,0,.26]){const s=new ze(n,this.magneticBandMaterial);s.position.set(e.size.x*i,e.size.y/2+.025,0),s.renderOrder=2,t.add(s)}}addMovingBands(t,e){const n=new Vn(e.size.x*.78,.026,.095);for(const i of[-.32,-.1,.12,.34]){const s=new ze(n,this.movingBandMaterial);s.position.set(0,e.size.y/2+.026,e.size.z*i),s.renderOrder=2,t.add(s)}}addMovingPathGuide(t){const e=t.motion;if(!e||e.kind!=="sine-translate")return;const n=Math.hypot(e.axis.x,e.axis.y,e.axis.z);if(n<=1e-9)return;const i=new V(e.axis.x/n,e.axis.y/n,e.axis.z/n),s=new V(t.position.x,t.position.y-.42,t.position.z).addScaledVector(i,-e.amplitude),o=new V(t.position.x,t.position.y-.42,t.position.z).addScaledVector(i,e.amplitude),a=new eh(new on().setFromPoints([s,o]),new us({color:11039537,transparent:!0,opacity:.52}));this.scene.add(a)}createTrackPieceMesh(t,e){const n=new ze(new Vn(t.size.x,t.size.y,t.size.z),e);return n.position.set(t.position.x,t.position.y,t.position.z),n.rotation.order="XYZ",n.rotation.set(t.rotation.x,t.rotation.y,t.rotation.z),n.receiveShadow=!1,n}addCheckpointMarkers(){const t=new Vn(2,.025,.12);for(const e of this.track.checkpoints){const n=new Oi({color:12118751,transparent:!0,opacity:.18,depthWrite:!1}),i=new ze(t,n);i.position.set(e.pose.position.x,e.trigger.y+.035,e.pose.position.z),i.rotation.y=e.pose.cameraYawRad,this.checkpointMarkers.push(i),this.scene.add(i)}}addGoalBeacon(){const t=new ze(new wa(1.65,.075,10,36),this.goalBeaconMaterial);t.position.set(this.track.goal.center.x,this.track.goal.center.y+1.15,this.track.goal.center.z),t.rotation.y=Math.PI/2,this.scene.add(t)}createInnerShell(){const t=new ba(Ie.ballRadius*.98,18,12),e=new Oi({color:12185314,transparent:!0,opacity:.045,wireframe:!0,side:Be,depthWrite:!1});return{mesh:new ze(t,e),material:e}}}function Qt(r){return r==null?"—":r.toFixed(2)}function Z0(){return window.innerHeight>window.innerWidth?"portrait":"landscape"}function vl(r){return r?`${r.durationSeconds.toFixed(1)}s / ${r.fallCount} falls`:"—"}class j0{constructor(t){this.root=t}root;render(t,e){const n=t.raw,i=e.validationEnabled?[`validation  ${e.validation.active?`${e.validation.elapsedSeconds.toFixed(1)}s`:"inactive"}  falls ${e.validation.fallCount}`,`best device portrait ${vl(e.bestPortrait)}`,`best device landscape ${vl(e.bestLandscape)}`]:[];this.root.textContent=[`prototype   ${e.modeLabel}`,`mode        ${e.gameplayActive?"physics active":"paused"}`,`source      ${t.source??"none"}`,`viewport    ${Z0()}  ${window.innerWidth}×${window.innerHeight}`,...i,`section     ${e.track.sectionLabel}`,`checkpoint  ${e.track.checkpointId}  goal ${Math.round(e.track.goalHoldProgress*100)}%${e.track.complete?" COMPLETE":""}`,`magnetic    ${e.ball.magnetic.active?`${e.ball.magnetic.pieceId??"active"}  ${Math.round(e.ball.magnetic.strength*100)}%`:"off"}`,`screen deg  x ${Qt(t.screenTiltDeg.x)}  y ${Qt(t.screenTiltDeg.y)}`,`neutral     x ${Qt(t.neutral?.x)}  y ${Qt(t.neutral?.y)}`,`relative    x ${Qt(t.relativeTiltDeg.x)}  y ${Qt(t.relativeTiltDeg.y)}`,`filtered    x ${Qt(t.normalized.x)}  y ${Qt(t.normalized.y)}`,`gravity cam x ${Qt(t.gravityDirection.x)}  y ${Qt(t.gravityDirection.y)}  z ${Qt(t.gravityDirection.z)}`,`gravity wrd x ${Qt(e.worldGravity.x)}  y ${Qt(e.worldGravity.y)}  z ${Qt(e.worldGravity.z)}`,`ball pos    x ${Qt(e.ball.position.x)}  y ${Qt(e.ball.position.y)}  z ${Qt(e.ball.position.z)}`,`velocity    x ${Qt(e.ball.velocity.x)}  y ${Qt(e.ball.velocity.y)}  z ${Qt(e.ball.velocity.z)}`,`speed       ${Qt(e.ball.speed)}  grounded ${e.ball.grounded?"yes":"no"}`,`camera yaw  ${Qt(e.camera.yawRad)} → ${Qt(e.camera.targetYawRad)}  pitch ${Qt(e.camera.pitchRad)}`,`heading     ${e.camera.headingState}  err ${Qt(e.camera.headingErrorRad)}`,`camera fov  ${Qt(e.camera.fovDeg)}°  resets ${e.fallResetCount}`,`raw beta    ${Qt(n?.betaDeg)}  gamma ${Qt(n?.gammaDeg)}  screen ${Qt(n?.screenAngleDeg)}`].join(`
`)}}function K0(r,t){const e=r.x-t.position.x,n=r.z-t.position.z,i=t.rotation.y,s=Math.cos(i),o=Math.sin(i),a=s*e-o*n,l=o*e+s*n,c=Math.max(0,Math.abs(a)-t.size.x/2),h=Math.max(0,Math.abs(l)-t.size.z/2);return c*c+h*h}function J0(r,t,e=0){let n=null,i=Number.POSITIVE_INFINITY,s=Number.POSITIVE_INFINITY,o=Number.POSITIVE_INFINITY;for(const a of t.pieces){const l=K0(r,a),c=r.x-a.position.x,h=r.y-a.position.y,d=r.z-a.position.z,u=h*h,p=c*c+d*d,g=l<i-1e-9,_=Math.abs(l-i)<=1e-9,m=u<s-1e-9,f=Math.abs(u-s)<=1e-9;(g||_&&m||_&&f&&p<o)&&(n=a,i=l,s=u,o=p)}return n?{pieceId:n.id,yawRad:n.rotation.y,footprintDistance:Math.sqrt(i)}:{pieceId:null,yawRad:e,footprintDistance:Number.POSITIVE_INFINITY}}function xl(r,t){const e=r.x-t.x,n=r.y-t.y,i=r.z-t.z;return e*e+n*n+i*i}function Q0(r,t){const{center:e,halfExtents:n}=t.goal;return Math.abs(r.x-e.x)<=n.x&&Math.abs(r.y-e.y)<=n.y&&Math.abs(r.z-e.z)<=n.z}class tx{constructor(t){this.track=t}track;checkpointIndex=0;goalHoldSeconds=0;complete=!1;reset(){this.checkpointIndex=0,this.goalHoldSeconds=0,this.complete=!1}update(t,e,n){if(this.advanceCheckpoint(t),this.complete)return;const i=Math.min(Math.max(n,0),.1);Q0(t,this.track)&&e<=this.track.goal.maxSpeed?(this.goalHoldSeconds+=i,this.goalHoldSeconds>=this.track.goal.holdSeconds&&(this.goalHoldSeconds=this.track.goal.holdSeconds,this.complete=!0)):this.goalHoldSeconds=0}recoveryPose(){return this.track.checkpoints[this.checkpointIndex].pose}snapshot(t){const e=this.nearestSection(t);return{section:e,sectionLabel:X0[e],checkpointId:this.track.checkpoints[this.checkpointIndex].id,checkpointIndex:this.checkpointIndex,goalHoldProgress:Math.min(1,this.goalHoldSeconds/this.track.goal.holdSeconds),complete:this.complete}}advanceCheckpoint(t){for(let e=this.checkpointIndex+1;e<this.track.checkpoints.length;e+=1){const n=this.track.checkpoints[e],i=n.triggerRadius*n.triggerRadius;xl(t,n.trigger)<=i&&(this.checkpointIndex=e)}}nearestSection(t){let e=this.track.pieces[0].section,n=Number.POSITIVE_INFINITY;for(const i of this.track.pieces){const s=xl(t,i.position);s<n&&(n=s,e=i.section)}return e}}const Ze={cameraFovDeg:76,cameraYawResponsePerSecond:4.2,ballInertia:(.35-.16)/(.35-.02),contactFriction:.48,contactRestitution:.08,tiltSensitivity:1,tiltDeadZoneDeg:1.5,tiltSaturationDeg:25,tiltSmoothingResponsePerSecond:12},vn={cameraFovDeg:{min:55,max:95,step:1},cameraYawResponsePerSecond:{min:1.5,max:10,step:.1},ballInertia:{min:0,max:1,step:.01},contactFriction:{min:.15,max:.9,step:.01},contactRestitution:{min:0,max:.25,step:.01},tiltSensitivity:{min:.5,max:2,step:.05},tiltDeadZoneDeg:{min:.25,max:4,step:.25},tiltSaturationDeg:{min:15,max:35,step:1},tiltSmoothingResponsePerSecond:{min:4,max:24,step:1}},Ah="inner-rail:p0.4-tuning:v2",ex="inner-rail:p0.2-tuning:v1";function xn(r,t,e){return Math.min(e,Math.max(t,r))}function On(r,t){return typeof r=="number"&&Number.isFinite(r)?r:t}function La(r){const t=vn.cameraFovDeg,e=vn.cameraYawResponsePerSecond,n=vn.ballInertia,i=vn.contactFriction,s=vn.contactRestitution,o=vn.tiltSensitivity,a=vn.tiltDeadZoneDeg,l=vn.tiltSaturationDeg,c=vn.tiltSmoothingResponsePerSecond;return{cameraFovDeg:xn(On(r.cameraFovDeg,Ze.cameraFovDeg),t.min,t.max),cameraYawResponsePerSecond:xn(On(r.cameraYawResponsePerSecond,Ze.cameraYawResponsePerSecond),e.min,e.max),ballInertia:xn(On(r.ballInertia,Ze.ballInertia),n.min,n.max),contactFriction:xn(On(r.contactFriction,Ze.contactFriction),i.min,i.max),contactRestitution:xn(On(r.contactRestitution,Ze.contactRestitution),s.min,s.max),tiltSensitivity:xn(On(r.tiltSensitivity,Ze.tiltSensitivity),o.min,o.max),tiltDeadZoneDeg:xn(On(r.tiltDeadZoneDeg,Ze.tiltDeadZoneDeg),a.min,a.max),tiltSaturationDeg:xn(On(r.tiltSaturationDeg,Ze.tiltSaturationDeg),l.min,l.max),tiltSmoothingResponsePerSecond:xn(On(r.tiltSmoothingResponsePerSecond,Ze.tiltSmoothingResponsePerSecond),c.min,c.max)}}function yl(r){if(!r)return null;try{return La(JSON.parse(r))}catch{return null}}function nx(){try{return yl(localStorage.getItem(Ah))??yl(localStorage.getItem(ex))??{...Ze}}catch{return{...Ze}}}function ix(r){try{localStorage.setItem(Ah,JSON.stringify(La(r)))}catch{}}function sx(r){const t=xn(r,0,1),e=.35;return e+(.02-e)*t}const Ml={INPUT:"輸入",PHYSICS:"物理",CAMERA:"相機"},xo=[{group:"INPUT",key:"tiltSensitivity",label:"傾斜靈敏度",hint:"數值越高，只要較小的手機傾斜角度就能產生較強的控制力；越低則需要傾斜更多。",format:r=>`${r.toFixed(2)}×`},{group:"INPUT",key:"tiltDeadZoneDeg",label:"中立死區",hint:"數值越高，越能忽略手持時的小幅晃動；太高會讓細微修正變得不靈敏。",format:r=>`${r.toFixed(2)}°`},{group:"INPUT",key:"tiltSaturationDeg",label:"滿輸出傾角",hint:"數值越低，手機只要傾斜一點就能達到最大控制力；越高則有更大的可控制傾斜範圍。",format:r=>`${Math.round(r)}°`},{group:"INPUT",key:"tiltSmoothingResponsePerSecond",label:"輸入反應速度",hint:"數值越低，輸入越平滑但反應較慢；越高則修正更快，但也更容易感覺敏感或抖動。",format:r=>`${r.toFixed(0)}×`},{group:"PHYSICS",key:"ballInertia",label:"球體慣性",hint:"數值越高，球會保留動量更久、滑得更遠；越低則更容易減速與停下。",format:r=>`${Math.round(r*100)}%`},{group:"PHYSICS",key:"contactFriction",label:"軌道摩擦力",hint:"數值越高，抓地與煞車效果越明顯；越低則更容易滑動。",format:r=>r.toFixed(2)},{group:"PHYSICS",key:"contactRestitution",label:"碰撞回彈",hint:"數值越高，落地或撞到邊緣時彈得越明顯；為了第一人稱舒適度通常不建議太高。",format:r=>r.toFixed(2)},{group:"CAMERA",key:"cameraFovDeg",label:"相機視野 / FOV",hint:"數值越低，畫面較像拉近、視野較窄；越高則看得更廣，但速度感也會更強。",format:r=>`${Math.round(r)}°`},{group:"CAMERA",key:"cameraYawResponsePerSecond",label:"軌道方向跟隨速度",hint:"控制相機多快轉向軌道的前進方向。越低轉得較慢、較穩；越高則更快對準彎道。球本身往後或側滑不會讓相機掉頭。",format:r=>`${r.toFixed(1)}×`}],rx=["INPUT","PHYSICS","CAMERA"];class ox{constructor(t,e,n){this.root=t,this.callbacks=n,this.values={...e},this.root.innerHTML=`
      <details class="tuning-panel">
        <summary>
          <span>調校</span>
          <small>原型手感</small>
        </summary>
        <div class="tuning-panel__body">
          ${rx.map(i=>`
            <section class="tuning-group" aria-label="${Ml[i]}參數調校">
              <p class="tuning-group__label">${Ml[i]}</p>
              ${xo.filter(s=>s.group===i).map(s=>{const o=vn[s.key];return`
                  <label class="tuning-control">
                    <span class="tuning-control__header">
                      <span>${s.label}</span>
                      <output data-tuning-value="${s.key}"></output>
                    </span>
                    <input
                      type="range"
                      min="${o.min}"
                      max="${o.max}"
                      step="${o.step}"
                      data-tuning-input="${s.key}"
                    />
                    <small>${s.hint}</small>
                  </label>
                `}).join("")}
            </section>
          `).join("")}
          <button type="button" class="tuning-reset" data-tuning-reset>重設為基準值</button>
        </div>
      </details>
    `;for(const i of xo){const s=this.requireElement(`[data-tuning-input="${i.key}"]`),o=this.requireElement(`[data-tuning-value="${i.key}"]`);this.inputs.set(i.key,s),this.valueLabels.set(i.key,o),s.addEventListener("input",()=>{this.values={...this.values,[i.key]:Number(s.value)},this.renderValues(),this.callbacks.onChange({...this.values})})}this.requireElement("[data-tuning-reset]").addEventListener("click",()=>{this.values={...Ze},this.renderValues(),this.callbacks.onReset()}),this.renderValues()}root;callbacks;values;inputs=new Map;valueLabels=new Map;setValues(t){this.values={...t},this.renderValues()}renderValues(){for(const t of xo){const e=this.values[t.key],n=this.inputs.get(t.key),i=this.valueLabels.get(t.key);n&&(n.value=String(e)),i&&(i.textContent=t.format(e))}}requireElement(t){const e=this.root.querySelector(t);if(!e)throw new Error(`Missing tuning element: ${t}`);return e}}class ax{constructor(t,e,n){this.root=t,this.callbacks=e,this.presentation=n,this.root.innerHTML=`
      <main class="prototype-shell" data-mode="start">
        <div class="scene-root" data-scene-root aria-hidden="true"></div>
        <div class="ambient-grid" aria-hidden="true"></div>
        <header class="prototype-header">
          <span class="eyebrow">INNER RAIL / ${this.presentation.milestoneLabel}</span>
          <span class="status-dot" aria-hidden="true"></span>
          <span class="orientation-chip orientation-chip--portrait">PORTRAIT TEST</span>
          <span class="orientation-chip orientation-chip--landscape">LANDSCAPE TEST</span>
          <span class="input-source-chip" data-input-source hidden></span>
        </header>
        <section class="vector-stage" data-vector-stage aria-label="Tilt force visualization">
          <div class="vector-ring vector-ring--outer"></div>
          <div class="vector-ring vector-ring--inner"></div>
          <div class="vector-axis vector-axis--x"></div>
          <div class="vector-axis vector-axis--y"></div>
          <div class="vector-origin"></div>
          <div class="vector-needle" data-vector-needle><span></span></div>
          <div class="vector-caption" data-vector-label>FIELD / NEUTRAL</div>
        </section>
        <section class="state-panel" data-state></section>
        <section class="synthetic-pad" data-synthetic-pad hidden aria-label="Synthetic tilt control">
          <div class="synthetic-crosshair"></div>
          <div class="synthetic-knob"></div>
          <span>SYNTHETIC INPUT · DEVICE TILT OFF</span>
        </section>
        <nav class="runtime-controls" data-controls hidden aria-label="Prototype controls">
          <button type="button" class="button button--ghost" data-restart>RESTART</button>
          <button type="button" class="button button--secondary" data-recenter>RECENTER</button>
        </nav>
        <pre class="telemetry" data-telemetry hidden></pre>
        <aside class="tuning-root" data-tuning-root hidden aria-label="Prototype tuning"></aside>
      </main>
    `,this.shell=this.requireElement(".prototype-shell"),this.sceneRoot=this.requireElement("[data-scene-root]"),this.stateRoot=this.requireElement("[data-state]"),this.controlsRoot=this.requireElement("[data-controls]"),this.vectorStage=this.requireElement("[data-vector-stage]"),this.vectorNeedle=this.requireElement("[data-vector-needle]"),this.vectorLabel=this.requireElement("[data-vector-label]"),this.syntheticPad=this.requireElement("[data-synthetic-pad]"),this.inputSourceChip=this.requireElement("[data-input-source]"),this.telemetryRoot=this.requireElement("[data-telemetry]"),this.tuningRoot=this.requireElement("[data-tuning-root]"),this.requireElement("[data-restart]").addEventListener("click",()=>e.onRestart()),this.requireElement("[data-recenter]").addEventListener("click",()=>e.onRecenter()),this.bindSyntheticPad()}root;callbacks;presentation;sceneRoot;telemetryRoot;tuningRoot;shell;stateRoot;controlsRoot;vectorStage;vectorNeedle;vectorLabel;syntheticPad;inputSourceChip;debugVisible=!1;active=!1;setDebugVisible(t){this.debugVisible=t,this.telemetryRoot.hidden=!t,this.tuningRoot.hidden=!t,this.vectorStage.hidden=this.active&&!t}renderState(t){if(this.active=t.kind==="active",this.shell.dataset.mode=t.kind,this.controlsRoot.hidden=!this.active,this.syntheticPad.hidden=!(this.active&&t.kind==="active"&&t.synthetic),this.stateRoot.hidden=this.active,this.vectorStage.hidden=this.active&&!this.debugVisible,t.kind==="active"?(this.inputSourceChip.hidden=!1,this.inputSourceChip.textContent=t.synthetic?"SYNTHETIC INPUT":"DEVICE MOTION",this.inputSourceChip.classList.toggle("input-source-chip--synthetic",t.synthetic),this.shell.dataset.inputSource=t.synthetic?"synthetic":"device"):(this.inputSourceChip.hidden=!0,this.inputSourceChip.classList.remove("input-source-chip--synthetic"),delete this.shell.dataset.inputSource),t.kind==="start"){const e=t.preferSynthetic?"DESKTOP TILT TEST":"ENABLE MOTION",n=t.preferSynthetic?"TRY DEVICE SENSOR":"USE SYNTHETIC INPUT",i=!t.deviceSupported&&t.preferSynthetic;this.stateRoot.innerHTML=`
        <p class="kicker">${this.presentation.kicker}</p>
        <h1>${this.presentation.title}</h1>
        <p>${this.presentation.body}</p>
        <div class="action-stack">
          <button type="button" class="button button--primary" data-primary>${e}</button>
          <button type="button" class="button button--ghost" data-secondary ${i?"disabled":""}>${n}</button>
        </div>
      `,this.requireElement("[data-primary]",this.stateRoot).addEventListener("click",()=>{t.preferSynthetic?this.callbacks.onStartSynthetic():this.callbacks.onStartDevice()}),this.requireElement("[data-secondary]",this.stateRoot).addEventListener("click",()=>{t.preferSynthetic?this.callbacks.onStartDevice():this.callbacks.onStartSynthetic()});return}if(t.kind==="requesting"){this.stateRoot.innerHTML='<p class="kicker">MOTION ACCESS</p><h1>Requesting sensor…</h1><p>Keep the browser active while motion access is resolved.</p>';return}if(t.kind==="awaiting-sensor"){this.stateRoot.innerHTML='<p class="kicker">SENSOR ONLINE</p><h1>Move the device once.</h1><p>Waiting for the first orientation sample.</p>';return}if(t.kind==="calibration"){this.stateRoot.innerHTML=`
        <p class="kicker">${t.sourceLabel.toUpperCase()} / NEUTRAL POSE</p>
        <h1>Hold naturally.</h1>
        <p>This pose becomes zero horizontal force. Rotating between portrait and landscape asks for a fresh neutral pose so the comparison stays valid.</p>
        <button type="button" class="button button--primary" data-calibrate>SET NEUTRAL & START</button>
      `,this.requireElement("[data-calibrate]",this.stateRoot).addEventListener("click",()=>this.callbacks.onCalibrate());return}if(t.kind==="active"){this.stateRoot.innerHTML="";return}this.stateRoot.innerHTML=`
      <p class="kicker">SENSOR RECOVERY</p>
      <h1>${t.title}</h1>
      <p>${t.detail}</p>
      <button type="button" class="button button--primary" data-fallback>USE SYNTHETIC INPUT</button>
    `,this.requireElement("[data-fallback]",this.stateRoot).addEventListener("click",()=>this.callbacks.onStartSynthetic())}renderVector(t,e){const n=Math.max(-1,Math.min(1,t)),i=Math.max(-1,Math.min(1,e)),s=Math.min(1,Math.hypot(n,i)),o=Math.atan2(i,n)*(180/Math.PI)+90;this.vectorNeedle.style.setProperty("--vector-angle",`${o}deg`),this.vectorNeedle.style.height=`${8+39*s}%`,this.vectorNeedle.style.opacity=`${.35+.65*s}`,this.vectorLabel.textContent=s<.02?"FIELD / NEUTRAL":`FIELD / ${(s*100).toFixed(0)}%`}bindSyntheticPad(){const t=this.requireElement(".synthetic-knob",this.syntheticPad),e=()=>{t.style.left="50%",t.style.top="50%",this.callbacks.onSyntheticTilt(0,0)},n=s=>{const o=this.syntheticPad.getBoundingClientRect(),a=(s.clientX-o.left)/o.width*2-1,l=(s.clientY-o.top)/o.height*2-1,c=Math.max(-1,Math.min(1,a)),h=Math.max(-1,Math.min(1,l));t.style.left=`${50+c*42}%`,t.style.top=`${50+h*42}%`,this.callbacks.onSyntheticTilt(c,h)};this.syntheticPad.addEventListener("pointerdown",s=>{this.syntheticPad.setPointerCapture(s.pointerId),n(s)}),this.syntheticPad.addEventListener("pointermove",s=>{this.syntheticPad.hasPointerCapture(s.pointerId)&&n(s)});const i=s=>{this.syntheticPad.hasPointerCapture(s.pointerId)&&this.syntheticPad.releasePointerCapture(s.pointerId),e()};this.syntheticPad.addEventListener("pointerup",i),this.syntheticPad.addEventListener("pointercancel",i)}requireElement(t,e=this.root){const n=e.querySelector(t);if(!n)throw new Error(`Missing required prototype element: ${t}`);return n}}const Rh="inner-rail:p0.4-validation-history:v1",Ch=12;class cx{startedAtMs=null;sectionStartedAtMs=null;section=null;orientation="portrait";source="synthetic";tuning=null;fallCount=0;sectionSeconds={};completionEmitted=!1;start(t,e,n,i,s){this.startedAtMs=t,this.sectionStartedAtMs=t,this.section=s.section,this.orientation=e,this.source=n,this.tuning={...i},this.fallCount=0,this.sectionSeconds={},this.completionEmitted=!1}cancel(){this.startedAtMs=null,this.sectionStartedAtMs=null,this.section=null,this.tuning=null,this.completionEmitted=!1}recordFall(){this.startedAtMs!==null&&(this.fallCount+=1)}update(t,e){return this.startedAtMs===null||this.sectionStartedAtMs===null||this.section===null||!this.tuning||(e.section!==this.section&&(this.commitSection(t),this.section=e.section,this.sectionStartedAtMs=t),!e.complete||this.completionEmitted)?null:(this.commitSection(t),this.completionEmitted=!0,{orientation:this.orientation,source:this.source,durationSeconds:Math.max(0,(t-this.startedAtMs)/1e3),fallCount:this.fallCount,sectionSeconds:{...this.sectionSeconds},tuning:{...this.tuning},completedAtIso:new Date().toISOString()})}snapshot(t){return{active:this.startedAtMs!==null&&!this.completionEmitted,elapsedSeconds:this.startedAtMs===null?0:Math.max(0,(t-this.startedAtMs)/1e3),fallCount:this.fallCount,sectionSeconds:this.sectionSecondsWithCurrent(t)}}commitSection(t){if(this.sectionStartedAtMs===null||this.section===null)return;const e=Math.max(0,(t-this.sectionStartedAtMs)/1e3);this.sectionSeconds[this.section]=(this.sectionSeconds[this.section]??0)+e}sectionSecondsWithCurrent(t){const e={...this.sectionSeconds};return this.sectionStartedAtMs!==null&&this.section!==null&&this.startedAtMs!==null&&(e[this.section]=(e[this.section]??0)+Math.max(0,(t-this.sectionStartedAtMs)/1e3)),e}}function Ph(){try{const r=localStorage.getItem(Rh);if(!r)return[];const t=JSON.parse(r);return Array.isArray(t)?t.filter(hx).slice(0,Ch):[]}catch{return[]}}function lx(r){const t=[r,...Ph()].slice(0,Ch);try{localStorage.setItem(Rh,JSON.stringify(t))}catch{}return t}function Sl(r,t){let e=null;for(const n of r)n.source!=="device"||n.orientation!==t||(!e||n.durationSeconds<e.durationSeconds)&&(e=n);return e}function hx(r){if(!r||typeof r!="object")return!1;const t=r;return(t.orientation==="portrait"||t.orientation==="landscape")&&(t.source==="device"||t.source==="synthetic")&&typeof t.durationSeconds=="number"&&Number.isFinite(t.durationSeconds)&&typeof t.fallCount=="number"&&!!t.tuning&&typeof t.completedAtIso=="string"}const Fe=-.5/2,Da=4.8,ye=Fe+Da,ux=8,yo=24,dx=6,Ih=4.8,fx=Fe+Da/2,xs=15,px=xs+Ih/2,mx={kind:"sine-translate",axis:{x:0,y:1,z:0},amplitude:Da/2,periodSeconds:ux,phaseRad:-Math.PI/2},gx={kind:"sine-translate",axis:{x:0,y:0,z:1},amplitude:Ih/2,periodSeconds:dx,phaseRad:-Math.PI/2},_x=[q("room-start","room-entry",0,Fe,-8,5.8,4.6),q("room-lower-approach","room-entry",0,Fe,-4.2,4.6,4.2),q("room-lower-turn-west","room-lower-route",-1.4,Fe,-1.6,4.2,4,0,-45),q("room-lower-west","room-lower-route",-4.6,Fe,-1,3.8,5.8,0,-90),q("room-lower-turn-north","room-lower-route",-7,Fe,.9,4,4,0,-45),q("room-lower-north","room-lower-route",-7,Fe,3.7,3.8,4.2),q("room-mag-00","room-lift",-7,Fe,5.6,4.2,2.4,0,0,0,"magnetic"),q("room-mag-12","room-lift",-7,Fe,7.6,4.2,2.4,0,0,12,"magnetic"),q("room-mag-24","room-lift",-7,Fe,9.6,4.2,2.4,0,0,yo,"magnetic"),q("room-magnetic-lift","room-lift",-7,fx,11.9,4.2,4.6,0,0,yo,"magnetic",mx),q("room-upper-receiver","room-upper-route",-7,ye,14.5,4.2,3.4,0,0,yo,"magnetic"),q("room-upper-turn-east","room-upper-route",-5.4,ye,15.2,4.2,4,0,45),q("room-upper-west-deck","room-upper-crossing",-3.2,ye,xs,3.8,4.8,0,90),q("room-moving-bridge","room-upper-crossing",0,ye,px,3.6,5,0,90,0,"moving",gx),q("room-upper-east-deck","room-upper-crossing",3.2,ye,xs,3.8,4.8,0,90),q("room-upper-turn-south","room-upper-return",5.6,ye,13,4,4.2,0,135),q("room-upper-south-a","room-upper-return",6,ye,9.6,3.8,6,0,180),q("room-upper-south-b","room-upper-return",6,ye,4.4,3.8,5.2,0,180),q("room-upper-south-c","room-upper-return",6,ye,1,3.8,3,0,180),q("room-upper-turn-home","room-upper-return",4.5,ye,-.5,4,4,0,-135),q("room-upper-home","room-goal",2.2,ye,-.5,4.2,4.8,0,-90),q("room-goal","room-goal",0,ye,-.5,5,4.6,0,-90,0,"goal")],El=[{id:"cp-room-start",section:"room-entry",trigger:{x:0,y:Fe,z:-8},triggerRadius:3,pose:{position:{x:0,y:Fe+1.3,z:-8},cameraYawRad:0}},{id:"cp-room-lift",section:"room-lift",trigger:{x:-7,y:Fe,z:8.7},triggerRadius:2.2,pose:{position:{x:-7,y:Fe+1.3,z:8.7},cameraYawRad:0}},{id:"cp-room-upper",section:"room-upper-route",trigger:{x:-7,y:ye,z:14.2},triggerRadius:2.2,pose:{position:{x:-7,y:ye+1.3,z:14.2},cameraYawRad:0}},{id:"cp-room-crossed",section:"room-upper-crossing",trigger:{x:3.6,y:ye,z:xs},triggerRadius:2.2,pose:{position:{x:3.6,y:ye+1.3,z:xs},cameraYawRad:Math.PI/2}},{id:"cp-room-return",section:"room-upper-return",trigger:{x:6,y:ye,z:3},triggerRadius:2.1,pose:{position:{x:6,y:ye+1.3,z:3},cameraYawRad:Math.PI}}],vx={pieces:_x,checkpoints:El,start:El[0].pose,goal:{center:{x:0,y:ye+.6,z:-.5},halfExtents:{x:2.3,y:2.5,z:2.5},maxSpeed:1.25,holdSeconds:.75},bounds:{minX:-11,maxX:10,minY:-8,maxY:12,minZ:-12,maxZ:22}},Me=-.5/2,Na=4.8,Ue=Me+Na,xx=6.5,Lh=4.8,yx=8,Mo=24,Mx=Me+Na/2,ys=-1,Sx=ys+Lh/2,Ex={kind:"sine-translate",axis:{x:0,y:0,z:1},amplitude:Lh/2,periodSeconds:xx,phaseRad:-Math.PI/2},Tx={kind:"sine-translate",axis:{x:0,y:1,z:0},amplitude:Na/2,periodSeconds:yx,phaseRad:-Math.PI/2},bx=[q("room-b-start","room-entry",6,Me,-8,5.8,4.6),q("room-b-east-run","room-entry",6,Me,-4.4,4.6,4),q("room-b-turn-west","room-lower-route",4.5,Me,-1.8,4,4,0,-45),q("room-b-bridge-entry","room-upper-crossing",2.3,Me,ys,3.8,4.2,0,-90),q("room-b-moving-bridge","room-upper-crossing",-.5,Me,Sx,3.6,4.8,0,-90,0,"moving",Ex),q("room-b-bridge-exit","room-lower-route",-3.5,Me,ys,3.8,4.2,0,-90),q("room-b-turn-north","room-lower-route",-5.5,Me,.5,4,4,0,-45),q("room-b-west-north","room-lower-route",-6,Me,3.5,3.8,5),q("room-b-mag-00","room-lift",-6,Me,6.3,4.2,2.4,0,0,0,"magnetic"),q("room-b-mag-12","room-lift",-6,Me,8.3,4.2,2.4,0,0,12,"magnetic"),q("room-b-mag-24","room-lift",-6,Me,10.3,4.2,2.4,0,0,Mo,"magnetic"),q("room-b-magnetic-lift","room-lift",-6,Mx,12.6,4.2,4.6,0,0,Mo,"magnetic",Tx),q("room-b-upper-receiver","room-upper-route",-6,Ue,15.2,4.2,3.4,0,0,Mo,"magnetic"),q("room-b-upper-turn-east","room-upper-route",-4.2,Ue,15.8,4,4,0,45),q("room-b-upper-north-west","room-upper-route",-1.2,Ue,16,3.8,6,0,90),q("room-b-upper-north-east","room-upper-route",3.7,Ue,16,3.8,5,0,90),q("room-b-upper-turn-south","room-upper-return",5.8,Ue,14.2,4,4,0,135),q("room-b-upper-south-a","room-upper-return",6,Ue,10.8,3.8,5.4,0,180),q("room-b-upper-south-b","room-upper-return",6,Ue,6,3.8,5.2,0,180),q("room-b-upper-south-c","room-upper-return",6,Ue,1.8,3.8,4.4,0,180),q("room-b-goal-approach","room-goal",6,Ue,-.7,4.4,3,0,180),q("room-b-goal","room-goal",6,Ue,-3,5,3.6,0,180,0,"goal")],Tl=[{id:"cp-room-b-start",section:"room-entry",trigger:{x:6,y:Me,z:-8},triggerRadius:3,pose:{position:{x:6,y:Me+1.3,z:-8},cameraYawRad:0}},{id:"cp-room-b-bridge",section:"room-upper-crossing",trigger:{x:2.3,y:Me,z:ys},triggerRadius:2.2,pose:{position:{x:2.3,y:Me+1.3,z:ys},cameraYawRad:-Math.PI/2}},{id:"cp-room-b-lift",section:"room-lift",trigger:{x:-6,y:Me,z:9.2},triggerRadius:2.2,pose:{position:{x:-6,y:Me+1.3,z:9.2},cameraYawRad:0}},{id:"cp-room-b-upper",section:"room-upper-route",trigger:{x:-6,y:Ue,z:15},triggerRadius:2.2,pose:{position:{x:-6,y:Ue+1.3,z:15},cameraYawRad:0}},{id:"cp-room-b-return",section:"room-upper-return",trigger:{x:6,y:Ue,z:5.5},triggerRadius:2.2,pose:{position:{x:6,y:Ue+1.3,z:5.5},cameraYawRad:Math.PI}}],wx={pieces:bx,checkpoints:Tl,start:Tl[0].pose,goal:{center:{x:6,y:Ue+.6,z:-3},halfExtents:{x:2.4,y:2.5,z:2},maxSpeed:1.25,holdSeconds:.75},bounds:{minX:-10,maxX:10,minY:-8,maxY:12,minZ:-12,maxZ:22}},Oe=-.5/2,Ua=4.8,ee=Oe+Ua,Ax=7.5,So=24,Rx=7,Cx=8,Eo=24,Px=Oe+Ua/2,Ix={kind:"sine-translate",axis:{x:0,y:1,z:0},amplitude:Ua/2,periodSeconds:Ax,phaseRad:-Math.PI/2},Lx={kind:"sine-translate",axis:{x:1,y:0,z:0},amplitude:Cx/2,periodSeconds:Rx,phaseRad:Math.PI/2},Dx=[q("room-c-start","room-entry",0,Oe,-9,5.8,4.8),q("room-c-approach","room-entry",0,Oe,-5.2,4.8,4.2),q("room-c-turn-east","room-lower-route",1.6,Oe,-2.5,4,4,0,45),q("room-c-lower-east","room-lower-route",4.5,Oe,-1.5,3.8,5.8,0,90),q("room-c-turn-north","room-lower-route",6.6,Oe,.5,4,4,0,45),q("room-c-lower-north","room-lower-route",7,Oe,3.7,3.8,5.2),q("room-c-mag-00","room-lift",7,Oe,6.5,4.2,2.4,0,0,0,"magnetic"),q("room-c-mag-12","room-lift",7,Oe,8.5,4.2,2.4,0,0,12,"magnetic"),q("room-c-mag-24","room-lift",7,Oe,10.5,4.2,2.4,0,0,So,"magnetic"),q("room-c-magnetic-lift","room-lift",7,Px,12.8,4.2,4.6,0,0,So,"magnetic",Ix),q("room-c-upper-receiver","room-upper-route",7,ee,15.3,4.2,3.4,0,0,So,"magnetic"),q("room-c-upper-turn-west","room-upper-route",5.4,ee,16.5,4,4,0,-45),q("room-c-shuttle-entry","room-upper-crossing",4,ee,18.2,4.2,3.4,0,0,Eo,"magnetic"),q("room-c-magnetic-shuttle","room-upper-crossing",0,ee,21.2,4.2,4.8,0,0,Eo,"magnetic",Lx),q("room-c-shuttle-receiver","room-upper-route",-4,ee,24.1,4.2,3.8,0,0,Eo,"magnetic"),q("room-c-unwind-12","room-upper-route",-4,ee,26.6,4.2,2.8,0,0,12,"magnetic"),q("room-c-unwind-00","room-upper-route",-4,ee,28.8,4.2,2.8,0,0,0,"magnetic"),q("room-c-turn-west","room-upper-return",-5.7,ee,29.5,4,4,0,-45),q("room-c-upper-west","room-upper-return",-7.2,ee,27.8,3.8,4.2,0,-90),q("room-c-turn-south","room-upper-return",-8.2,ee,25.5,4,4,0,-135),q("room-c-upper-south-a","room-upper-return",-8,ee,21.7,3.8,6,0,180),q("room-c-upper-south-b","room-upper-return",-8,ee,16.2,3.8,5.6,0,180),q("room-c-upper-south-c","room-upper-return",-8,ee,10.8,3.8,5.6,0,180),q("room-c-upper-south-d","room-upper-return",-8,ee,5.4,3.8,5.6,0,180),q("room-c-upper-south-e","room-upper-return",-8,ee,.2,3.8,5.4,0,180),q("room-c-turn-home","room-upper-return",-6.2,ee,-2.5,4,4,0,135),q("room-c-upper-home-west","room-goal",-3.8,ee,-4,3.8,5.2,0,90),q("room-c-goal-approach","room-goal",-1.2,ee,-4,4.2,3.4,0,90),q("room-c-goal","room-goal",.8,ee,-4,5,3.4,0,90,0,"goal")],bl=[{id:"cp-room-c-start",section:"room-entry",trigger:{x:0,y:Oe,z:-9},triggerRadius:3,pose:{position:{x:0,y:Oe+1.3,z:-9},cameraYawRad:0}},{id:"cp-room-c-lift",section:"room-lift",trigger:{x:7,y:Oe,z:9.3},triggerRadius:2.2,pose:{position:{x:7,y:Oe+1.3,z:9.3},cameraYawRad:0}},{id:"cp-room-c-upper",section:"room-upper-route",trigger:{x:7,y:ee,z:15.1},triggerRadius:2.2,pose:{position:{x:7,y:ee+1.3,z:15.1},cameraYawRad:0}},{id:"cp-room-c-shuttle",section:"room-upper-crossing",trigger:{x:4,y:ee,z:18.2},triggerRadius:2.2,pose:{position:{x:4,y:ee+1.3,z:18.2},cameraYawRad:0}},{id:"cp-room-c-receiver",section:"room-upper-route",trigger:{x:-4,y:ee,z:24.5},triggerRadius:2.2,pose:{position:{x:-4,y:ee+1.3,z:24.5},cameraYawRad:0}},{id:"cp-room-c-return",section:"room-upper-return",trigger:{x:-8,y:ee,z:9.8},triggerRadius:2.2,pose:{position:{x:-8,y:ee+1.3,z:9.8},cameraYawRad:Math.PI}}],Nx={pieces:Dx,checkpoints:bl,start:bl[0].pose,goal:{center:{x:.8,y:ee+.6,z:-4},halfExtents:{x:2.4,y:2.5,z:2},maxSpeed:1.25,holdSeconds:.75},bounds:{minX:-12,maxX:11,minY:-8,maxY:12,minZ:-13,maxZ:34}},Dh=[{id:"p2-room-a",role:"teach",track:vx,title:"See the goal. Learn how this room folds.",body:"Teach room: follow one compact lower route to the magnetic lift, cross the upper moving bridge, then recognize the same chamber from above as the path returns to the goal."},{id:"p2-room-b",role:"vary",track:wx,title:"Cross first. Climb later. Return above your old route.",body:"Variation room: solve the moving timing problem on the floor before finding the magnetic lift on the far side. The upper return then retraces the chamber from a different height."},{id:"p2-room-c",role:"mastery",track:Nx,title:"Combine the room map with both moving magnetic relationships.",body:"Mastery room: climb on a moving magnetic lift, later ride a sideways magnetic shuttle, and keep the larger room layout in mind as the route folds back toward the goal visible near the start."}];function Ux(r){return Dh.find(t=>t.id===r)??null}const Pe=-.5/2,en=-2.6,He=2.6,Fx=7,Ox=He-en,zx=48,Bx={kind:"sine-translate",axis:{x:1,y:0,z:0},amplitude:Ox/2,periodSeconds:Fx,phaseRad:-Math.PI/2},kx=[q("cmp-start","magnetic-intro",en,Pe,-28,7.2,9),q("cmp-approach","magnetic-intro",en,Pe,-21.3,6.2,5.4),q("cmp-ramp-00","magnetic-intro",en,Pe,-17.4,5,3.8,0,0,0,"magnetic"),q("cmp-ramp-12","magnetic-overhang",en,Pe,-14.1,5,3.8,0,0,12,"magnetic"),q("cmp-ramp-24","magnetic-overhang",en,Pe,-10.8,5,3.8,0,0,24,"magnetic"),q("cmp-ramp-36","magnetic-overhang",en,Pe,-7.5,5,3.8,0,0,36,"magnetic"),q("cmp-ramp-48","magnetic-overhang",en,Pe,-4.2,5,3.8,0,0,48,"magnetic"),q("cmp-magnetic-shuttle","moving-crossing",0,Pe,.5,5,5.8,0,0,zx,"magnetic",Bx),q("cmp-receiver-48","magnetic-overhang",He,Pe,5.7,5,5,0,0,48,"magnetic"),q("cmp-return-36","magnetic-release",He,Pe,9.9,5,3.8,0,0,36,"magnetic"),q("cmp-return-24","magnetic-release",He,Pe,13.2,5,3.8,0,0,24,"magnetic"),q("cmp-return-12","magnetic-release",He,Pe,16.5,5,3.8,0,0,12,"magnetic"),q("cmp-return-00","magnetic-release",He,Pe,19.8,5,3.8,0,0,0,"magnetic"),q("cmp-release","moving-release",He,Pe,23.6,5.4,4.6),q("cmp-brake","moving-release",He,Pe,28.6,5.8,6),q("cmp-goal","moving-release",He,Pe,34.2,6.4,5.8,0,0,0,"goal")],wl=[{id:"cp-composition-start",section:"magnetic-intro",trigger:{x:en,y:0,z:-28},triggerRadius:3,pose:{position:{x:en,y:1.05,z:-28},cameraYawRad:0}},{id:"cp-composition-shuttle",section:"moving-crossing",trigger:{x:en,y:0,z:-4.2},triggerRadius:2.2,pose:{position:{x:en,y:1.05,z:-4.4},cameraYawRad:0}},{id:"cp-composition-receiver",section:"magnetic-release",trigger:{x:He,y:0,z:6.7},triggerRadius:2.3,pose:{position:{x:He,y:1.05,z:6.4},cameraYawRad:0}},{id:"cp-composition-release",section:"moving-release",trigger:{x:He,y:0,z:22.2},triggerRadius:2.2,pose:{position:{x:He,y:1.05,z:22.5},cameraYawRad:0}}],Vx={pieces:kx,checkpoints:wl,start:wl[0].pose,goal:{center:{x:He,y:.6,z:34.2},halfExtents:{x:3.2,y:2.5,z:2.5},maxSpeed:1.25,holdSeconds:.75},bounds:{minX:-9,maxX:9,minY:-10,maxY:10,minZ:-36,maxZ:43}},Mn=-.5/2,Gx=8,Fa=4.6,Hx=36,nn=Mn+Fa,Wx=Mn+Fa/2,Xx={kind:"sine-translate",axis:{x:0,y:1,z:0},amplitude:Fa/2,periodSeconds:Gx,phaseRad:-Math.PI/2},qx=[q("gen-start","magnetic-intro",0,Mn,-28,7.2,9),q("gen-approach","magnetic-intro",0,Mn,-21.3,6.2,5.4),q("gen-ramp-00","magnetic-intro",0,Mn,-17.4,5,3.8,0,0,0,"magnetic"),q("gen-ramp-12","magnetic-overhang",0,Mn,-14.1,5,3.8,0,0,12,"magnetic"),q("gen-ramp-24","magnetic-overhang",0,Mn,-10.8,5,3.8,0,0,24,"magnetic"),q("gen-ramp-36","magnetic-overhang",0,Mn,-7.5,5,3.8,0,0,36,"magnetic"),q("gen-magnetic-lift","moving-crossing",0,Wx,-2.6,4.6,6,0,0,Hx,"magnetic",Xx),q("gen-upper-receiver-36","magnetic-overhang",0,nn,3.2,4.6,5.4,0,0,36,"magnetic"),q("gen-upper-24","magnetic-release",0,nn,7.5,5,3.8,0,0,24,"magnetic"),q("gen-upper-12","magnetic-release",0,nn,10.8,5,3.8,0,0,12,"magnetic"),q("gen-upper-00","magnetic-release",0,nn,14.1,5,3.8,0,0,0,"magnetic"),q("gen-release","moving-release",0,nn,18,5.4,4.6),q("gen-brake","moving-release",0,nn,23,5.8,6),q("gen-goal","moving-release",0,nn,28.6,6.4,5.8,0,0,0,"goal")],Al=[{id:"cp-generalization-start",section:"magnetic-intro",trigger:{x:0,y:Mn,z:-28},triggerRadius:3,pose:{position:{x:0,y:1.05,z:-28},cameraYawRad:0}},{id:"cp-generalization-lift",section:"moving-crossing",trigger:{x:0,y:Mn,z:-7.6},triggerRadius:2.2,pose:{position:{x:0,y:1.05,z:-7.8},cameraYawRad:0}},{id:"cp-generalization-upper",section:"magnetic-release",trigger:{x:0,y:nn,z:4.8},triggerRadius:2.2,pose:{position:{x:0,y:nn+1.05,z:4.6},cameraYawRad:0}},{id:"cp-generalization-release",section:"moving-release",trigger:{x:0,y:nn,z:16.2},triggerRadius:2.2,pose:{position:{x:0,y:nn+1.05,z:16.3},cameraYawRad:0}}],Yx={pieces:qx,checkpoints:Al,start:Al[0].pose,goal:{center:{x:0,y:nn+.6,z:28.6},halfExtents:{x:3.2,y:2.5,z:2.5},maxSpeed:1.25,holdSeconds:.75},bounds:{minX:-8,maxX:8,minY:-8,maxY:11,minZ:-36,maxZ:37}},pr=-.5/2,$x=-14.2,Zx=3.35,jx=3.8,Hi=-.8,To=-1.45,Nh=5.8,Kx=[0,12,24,36,48,60,70,78,78,70,60],Jx=1.4,fa=Kx.map((r,t)=>q(`m-transition-${t.toString().padStart(2,"0")}`,"magnetic-overhang",0,pr,$x+t*Zx,4.8,jx,0,0,r,"magnetic")),Rl=fa[fa.length-1],Qx=Rl.position.z+Rl.size.z/2,ty=Qx+Jx,Er=ty+Nh/2,Uh=Er+5.6,pa=Uh+6,ey=[q("m-start","magnetic-intro",0,pr,-30,7.5,9),q("m-approach","magnetic-intro",0,pr,-22.8,6.2,5.8),q("m-flat","magnetic-intro",0,pr,-17.4,5,5.8,0,0,0,"magnetic"),...fa,q("m-release-landing","magnetic-release",Hi,To,Er,6,Nh),q("m-release-brake","magnetic-release",Hi,To,Uh,5.6,5.8),q("m-goal","magnetic-release",Hi,To,pa,6.4,6.6,0,0,0,"goal")],Cl=[{id:"cp-magnetic-start",section:"magnetic-intro",trigger:{x:0,y:0,z:-30},triggerRadius:3,pose:{position:{x:0,y:1.05,z:-30},cameraYawRad:0}},{id:"cp-magnetic-entry",section:"magnetic-overhang",trigger:{x:0,y:0,z:-17.4},triggerRadius:2.2,pose:{position:{x:0,y:1.05,z:-17.4},cameraYawRad:0}},{id:"cp-magnetic-catch",section:"magnetic-release",trigger:{x:Hi,y:-.55,z:Er},triggerRadius:2.5,pose:{position:{x:Hi,y:-.4,z:Er},cameraYawRad:0}}],ny={pieces:ey,checkpoints:Cl,start:Cl[0].pose,goal:{center:{x:Hi,y:-.55,z:pa},halfExtents:{x:3.1,y:2.5,z:2.7},maxSpeed:1.25,holdSeconds:.75},bounds:{minX:-10,maxX:10,minY:-10,maxY:10,minZ:-38,maxZ:pa+10}},hi=-.5/2,iy=6,Fh=4.8,sy={kind:"sine-translate",axis:{x:1,y:0,z:0},amplitude:Fh/2,periodSeconds:iy,phaseRad:-Math.PI/2},ry=[q("mv-start","moving-intro",0,hi,-25,7.5,10),q("mv-approach","moving-intro",0,hi,-16,6.5,8),q("mv-wait","moving-intro",0,hi,-9.5,6,5),q("mv-shuttle","moving-crossing",Fh/2,hi,-3.5,3.2,7.4,0,0,0,"moving",sy),q("mv-exit","moving-release",0,hi,2.8,5.6,5.6),q("mv-brake","moving-release",0,hi,8.9,5.6,7),q("mv-goal","moving-release",0,hi,15.2,6.4,6.2,0,0,0,"goal")],Pl=[{id:"cp-moving-start",section:"moving-intro",trigger:{x:0,y:0,z:-25},triggerRadius:3,pose:{position:{x:0,y:1.05,z:-25},cameraYawRad:0}},{id:"cp-moving-wait",section:"moving-crossing",trigger:{x:0,y:0,z:-10},triggerRadius:2.2,pose:{position:{x:0,y:1.05,z:-10},cameraYawRad:0}},{id:"cp-moving-exit",section:"moving-release",trigger:{x:0,y:0,z:2.8},triggerRadius:2.4,pose:{position:{x:0,y:1.05,z:3.1},cameraYawRad:0}}],oy={pieces:ry,checkpoints:Pl,start:Pl[0].pose,goal:{center:{x:0,y:.6,z:15.2},halfExtents:{x:3.2,y:2.5,z:2.6},maxSpeed:1.25,holdSeconds:.75},bounds:{minX:-8,maxX:10,minY:-8,maxY:8,minZ:-34,maxZ:24}},ay={id:"p0",track:Ia,validationEnabled:!0,presentation:{milestoneLabel:"P0.4",kicker:"PHONE FEEL / COMFORT GATE",title:"One track. One physical rule.",body:"Run the validation course, tune only what changes control readability, and compare portrait vs landscape under the same rule set."}},cy={id:"p1-magnetic",track:ny,validationEnabled:!1,presentation:{milestoneLabel:"P1.1 / MAGNETIC RAIL · ACCEPTED",kicker:"PHYSICAL PUZZLE VOCABULARY",title:"Prepare before the glow ends.",body:"Accepted Magnetic Rail regression route: manage speed through the 78° wall ride and prepare momentum before the magnetic state releases onto ordinary track."}},ly={id:"p1-moving",track:oy,validationEnabled:!1,presentation:{milestoneLabel:"P1.2 / MOVING RAIL",kicker:"PHYSICAL PUZZLE VOCABULARY",title:"Read the cycle. Choose when to commit.",body:"Isolated Moving Rail regression route. The amber bridge follows a fixed lateral cycle without a countdown or new player input."}},hy={id:"p1-composition",track:Vx,validationEnabled:!1,presentation:{milestoneLabel:"P1.3 / MAGNETIC SHUTTLE · ACCEPTED",kicker:"FIRST MECHANIC COMPOSITION",title:"Stay attached. Leave on alignment.",body:"Accepted first composition: ride the 48° magnetic shuttle sideways and commit to the opposite receiver when the surfaces align."}},uy={id:"p1-generalization",track:Yx,validationEnabled:!1,presentation:{milestoneLabel:"P1.4 / COMPOSITION GENERALIZATION · ACCEPTED",kicker:"SYSTEM DEPTH GATE",title:"Ride upward. Prepare before the upper dock arrives.",body:"Accepted second composition: control position on the vertical magnetic lift and prepare momentum before leaving for the upper receiver."}};function dy(r){return r.role==="teach"?"ROOM A · TEACH":r.role==="vary"?"ROOM B · VARY":"ROOM C · MASTERY"}function Il(r){return{id:r.id,track:r.track,validationEnabled:!1,presentation:{milestoneLabel:`P2.2 / ${dy(r)}`,kicker:"AUTHORED SPATIAL PUZZLE SET",title:r.title,body:r.body}}}function fy(r){const t=new URLSearchParams(r).get("stage");if(t==="p0")return ay;if(t==="p1-magnetic")return cy;if(t==="p1-moving")return ly;if(t==="p1-composition")return hy;if(t==="p1-generalization")return uy;const e=Ux(t);return Il(e||Dh[0])}const py=1800;class my{tiltInput=new c_;deviceSource=new Mr;syntheticSource=new o_;mode;physics;trackProgress;validationRun=new cx;camera=new n_;overlay;scene;telemetry;tuningPanel;activeSource=null;sensorTimeoutId=null;animationFrameId=null;lastFrameAtMs=null;gameplayActive=!1;fallResetCount=0;syntheticKeyboard={left:!1,right:!1,forward:!1,back:!1};viewportOrientation;worldGravityDirection={x:0,y:-1,z:0};tuning=nx();validationHistory=Ph();constructor(t){this.mode=fy(location.search),this.physics=new Y0(this.mode.track),this.trackProgress=new tx(this.mode.track),this.overlay=new ax(t,{onStartDevice:()=>{this.startDevice()},onStartSynthetic:()=>{this.startSynthetic()},onCalibrate:()=>this.calibrate(),onRestart:()=>this.restart(),onRecenter:()=>this.recenter(),onSyntheticTilt:(n,i)=>this.syntheticSource.setNormalized(n,i)},this.mode.presentation),this.scene=new $0(this.overlay.sceneRoot,this.mode.track),this.telemetry=new j0(this.overlay.telemetryRoot),this.tuningPanel=new ox(this.overlay.tuningRoot,this.tuning,{onChange:n=>this.applyTuning(n),onReset:()=>this.resetTuning()}),this.applyTuning(this.tuning,!1);const e=new URLSearchParams(location.search).get("debug")==="1";this.overlay.setDebugVisible(e),this.viewportOrientation=this.readViewportOrientation(),this.camera.reset(this.physics.getBallState(),this.mode.track.start.cameraYawRad),this.scene.setTrackProgress(this.trackProgress.snapshot(this.mode.track.start.position)),this.resizeScene(),this.bindKeyboard(),window.addEventListener("resize",this.handleViewportResize)}start(){const t=window.matchMedia("(pointer: fine)").matches;this.overlay.renderState({kind:"start",preferSynthetic:t,deviceSupported:Mr.isSupported()}),this.tick()}destroy(){this.activeSource?.stop(),this.sensorTimeoutId!==null&&window.clearTimeout(this.sensorTimeoutId),this.animationFrameId!==null&&cancelAnimationFrame(this.animationFrameId),window.removeEventListener("resize",this.handleViewportResize),this.scene.destroy()}async startDevice(){this.stopActiveSource(),this.pauseGameplay(),this.tiltInput.clearCalibration(),this.viewportOrientation=this.readViewportOrientation(),this.overlay.renderState({kind:"requesting"});const t=await this.deviceSource.start(e=>{this.tiltInput.ingest(e),this.sensorTimeoutId!==null&&(window.clearTimeout(this.sensorTimeoutId),this.sensorTimeoutId=null,this.overlay.renderState({kind:"calibration",sourceLabel:`device sensor / ${this.viewportOrientation}`}))});if(t.status!=="started"){this.overlay.renderState({kind:"error",title:t.status==="denied"?"Motion access blocked.":"Motion sensor unavailable.",detail:t.reason});return}this.activeSource=this.deviceSource,this.overlay.renderState({kind:"awaiting-sensor"}),this.sensorTimeoutId=window.setTimeout(()=>{this.sensorTimeoutId=null,this.tiltInput.snapshot().hasSample||(this.deviceSource.stop(),this.activeSource=null,this.overlay.renderState({kind:"error",title:"No motion samples received.",detail:"The browser exposed the API but did not deliver orientation data. You can still verify the full physics loop with synthetic controls."}))},py)}async startSynthetic(){this.stopActiveSource(),this.pauseGameplay(),this.tiltInput.clearCalibration(),this.viewportOrientation=this.readViewportOrientation(),(await this.syntheticSource.start(e=>this.tiltInput.ingest(e))).status==="started"&&(this.activeSource=this.syntheticSource,this.overlay.renderState({kind:"calibration",sourceLabel:`synthetic input / ${this.viewportOrientation}`}))}calibrate(){this.tiltInput.recenter()&&(this.resetSimulation(),this.gameplayActive=!0,this.overlay.renderState({kind:"active",synthetic:this.activeSource?.kind==="synthetic"}),this.startValidationRun(performance.now()))}restart(){this.gameplayActive&&(this.resetSimulation(),this.startValidationRun(performance.now()))}recenter(){this.tiltInput.recenter()}applyTuning(t,e=!0){this.tuning=La(t),this.camera.setTuning({baseFovDeg:this.tuning.cameraFovDeg,yawResponsePerSecond:this.tuning.cameraYawResponsePerSecond}),this.physics.setBallLinearDamping(sx(this.tuning.ballInertia)),this.physics.setContactTuning(this.tuning.contactFriction,this.tuning.contactRestitution),this.tiltInput.setSensitivityMultiplier(this.tuning.tiltSensitivity),this.tiltInput.setResponseTuning({deadZoneDeg:this.tuning.tiltDeadZoneDeg,saturationDeg:this.tuning.tiltSaturationDeg,smoothingResponsePerSecond:this.tuning.tiltSmoothingResponsePerSecond}),e&&(ix(this.tuning),this.validationRun.cancel())}resetTuning(){this.tuning={...Ze},this.tuningPanel.setValues(this.tuning),this.applyTuning(this.tuning)}resetSimulation(){this.physics.resetTrackMotion(),this.trackProgress.reset(),this.resetToPose(this.mode.track.start)}recoverToCheckpoint(){this.resetToPose(this.trackProgress.recoveryPose())}resetToPose(t){this.physics.resetBall(t),this.physics.setVerticalGravity(),this.worldGravityDirection={x:0,y:-1,z:0},this.camera.reset(this.physics.getBallState(),t.cameraYawRad)}startValidationRun(t){if(!this.mode.validationEnabled)return;const e=this.activeSource?.kind;if(!e)return;const n=this.physics.getBallState();this.validationRun.start(t,this.viewportOrientation,e,this.tuning,this.trackProgress.snapshot(n.position))}pauseGameplay(){this.gameplayActive=!1,this.validationRun.cancel(),this.physics.setVerticalGravity(),this.worldGravityDirection={x:0,y:-1,z:0}}stopActiveSource(){this.sensorTimeoutId!==null&&(window.clearTimeout(this.sensorTimeoutId),this.sensorTimeoutId=null),this.activeSource?.stop(),this.activeSource=null}readViewportOrientation(){return window.innerHeight>window.innerWidth?"portrait":"landscape"}resizeScene(){this.scene.resize(window.innerWidth,window.innerHeight),this.camera.resize(window.innerWidth,window.innerHeight)}handleViewportResize=()=>{this.resizeScene();const t=this.readViewportOrientation();if(t===this.viewportOrientation||(this.viewportOrientation=t,!this.activeSource||!this.tiltInput.snapshot().neutral))return;this.pauseGameplay(),this.tiltInput.clearCalibration();const e=`${this.activeSource.kind==="device"?"device sensor":"synthetic input"} / ${t}`;this.overlay.renderState({kind:"calibration",sourceLabel:e})};bindKeyboard(){const t=n=>{switch(n.toLowerCase()){case"a":case"arrowleft":return"left";case"d":case"arrowright":return"right";case"w":case"arrowup":return"forward";case"s":case"arrowdown":return"back";default:return null}},e=()=>{if(this.activeSource?.kind!=="synthetic")return;const n=Number(this.syntheticKeyboard.right)-Number(this.syntheticKeyboard.left),i=Number(this.syntheticKeyboard.back)-Number(this.syntheticKeyboard.forward);this.syntheticSource.setNormalized(n,i)};window.addEventListener("keydown",n=>{const i=t(n.key);i&&(n.preventDefault(),this.syntheticKeyboard[i]=!0,e())}),window.addEventListener("keyup",n=>{const i=t(n.key);i&&(n.preventDefault(),this.syntheticKeyboard[i]=!1,e())})}tick=()=>{const t=performance.now(),e=this.lastFrameAtMs===null?1/60:Math.min(.1,Math.max(0,(t-this.lastFrameAtMs)/1e3));this.lastFrameAtMs=t,this.tiltInput.update(t);const n=this.tiltInput.snapshot();if(this.gameplayActive){const o=this.physics.getBallState(),a=o.magnetic.inwardNormal;this.worldGravityDirection=o.magnetic.active&&a?m_(n.gravityDirection,this.camera.currentYawRad,a):l_(n.gravityDirection,this.camera.currentYawRad),this.physics.setGravityDirection(this.worldGravityDirection),this.physics.step(e);const l=this.physics.getBallState();if(this.trackProgress.update(l.position,l.speed,e),this.physics.isOutOfBounds())this.fallResetCount+=1,this.mode.validationEnabled&&this.validationRun.recordFall(),this.recoverToCheckpoint();else{const c=J0(l.position,this.mode.track,this.camera.currentYawRad);this.camera.update(l,c.yawRad,e)}}const i=this.physics.getBallState(),s=this.trackProgress.snapshot(i.position);if(this.mode.validationEnabled){const o=this.validationRun.update(t,s);o&&(this.validationHistory=lx(o))}this.overlay.renderVector(n.normalized.x,n.normalized.y),this.telemetry.render(n,{ball:i,camera:this.camera.telemetry(),track:s,validation:this.validationRun.snapshot(t),validationEnabled:this.mode.validationEnabled,modeLabel:this.mode.presentation.milestoneLabel,bestPortrait:Sl(this.validationHistory,"portrait"),bestLandscape:Sl(this.validationHistory,"landscape"),worldGravity:this.worldGravityDirection,fallResetCount:this.fallResetCount,gameplayActive:this.gameplayActive}),this.scene.setTrackProgress(s),this.scene.render(this.camera.camera,i,this.physics.getMovingTrackState()),this.animationFrameId=requestAnimationFrame(this.tick)}}function gy(){const r=document.querySelector("#app");if(!r)throw new Error("Missing #app mount element.");const t=r;try{const e=new my(t);e.start(),window.addEventListener("pagehide",()=>e.destroy(),{once:!0}),t.dataset.bootstrapReady="true"}catch(e){const n=e instanceof Error?e.message:"Unknown bootstrap failure.";t.dataset.bootstrapError=n,t.innerHTML=`
      <main class="bootstrap-error" role="alert">
        <span>INNER RAIL / BOOT FAILURE</span>
        <h1>Prototype could not start.</h1>
        <p>${_y(n)}</p>
        <button type="button" onclick="location.reload()">RETRY</button>
      </main>
    `,console.error("[inner-rail] bootstrap failed",e)}}function _y(r){return r.replace(/[&<>'"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[t]??t)}gy();
