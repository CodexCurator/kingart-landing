/* --- Embedded Simplex Noise Library (Minified) --- */
const SimplexNoise = (() => { /* ... [Full noise library code from previous responses] ... */ const F2=0.5*(Math.sqrt(3.0)-1.0),G2=(3.0-Math.sqrt(3.0))/6.0,F3=1.0/3.0,G3=1.0/6.0;function SimplexNoise(random){if(!random)random=Math.random;this.p=new Uint8Array(256);this.perm=new Uint8Array(512);this.permMod12=new Uint8Array(512);for(let i=0;i<256;i++){this.p[i]=i}for(let i=0;i<255;i++){let r=i+~~(random()*(256-i));let aux=this.p[i];this.p[i]=this.p[r];this.p[r]=aux}for(let i=0;i<512;i++){this.perm[i]=this.p[i&255];this.permMod12[i]=this.perm[i]%12}}SimplexNoise.prototype={grad3:new Float32Array([1,1,0,-1,1,0,1,-1,0,-1,-1,0,1,0,1,-1,0,1,1,0,-1,-1,0,-1,0,1,1,0,-1,1,0,1,-1,0,-1,-1]),noise3D:function(xin,yin,zin){let n0,n1,n2,n3;let s=(xin+yin+zin)*F3;let i=Math.floor(xin+s),j=Math.floor(yin+s),k=Math.floor(zin+s);let t=(i+j+k)*G3;let X0=i-t,Y0=j-t,Z0=k-t;let x0=xin-X0,y0=yin-Y0,z0=zin-Z0;let i1,j1,k1,i2,j2,k2;if(x0>=y0){if(y0>=z0){i1=1;j1=0;k1=0;i2=1;j2=1;k2=0}else if(x0>=z0){i1=1;j1=0;k1=0;i2=1;j2=0;k2=1}else{i1=0;j1=0;k1=1;i2=1;j2=0;k2=1}}else{if(y0<z0){i1=0;j1=0;k1=1;i2=0;j2=1;k2=1}else if(x0<z0){i1=0;j1=1;k1=0;i2=0;j2=1;k2=1}else{i1=0;j1=1;k1=0;i2=1;j2=1;k2=0}}let x1=x0-i1+G3,y1=y0-j1+G3,z1=z0-k1+G3;let x2=x0-i2+2.0*G3,y2=y0-j2+2.0*G3,z2=z0-k2+2.0*G3;let x3=x0-1.0+3.0*G3,y3=y0-1.0+3.0*G3,z3=z0-1.0+3.0*G3;let ii=i&255,jj=j&255,kk=k&255;let gi0=this.permMod12[ii+this.perm[jj+this.perm[kk]]];let gi1=this.permMod12[ii+i1+this.perm[jj+j1+this.perm[kk+k1]]];let gi2=this.permMod12[ii+i2+this.perm[jj+j2+this.perm[kk+k2]]];let gi3=this.permMod12[ii+1+this.perm[jj+1+this.perm[kk+1]]];let t0=0.6-x0*x0-y0*y0-z0*z0;if(t0<0)n0=0.0;else{t0*=t0;n0=t0*t0*(this.grad3[gi0]*x0+this.grad3[gi0+1]*y0+this.grad3[gi0+2]*z0)}let t1=0.6-x1*x1-y1*y1-z1*z1;if(t1<0)n1=0.0;else{t1*=t1;n1=t1*t1*(this.grad3[gi1]*x1+this.grad3[gi1+1]*y1+this.grad3[gi1+2]*z1)}let t2=0.6-x2*x2-y2*y2-z2*z2;if(t2<0)n2=0.0;else{t2*=t2;n2=t2*t2*(this.grad3[gi2]*x2+this.grad3[gi2+1]*y2+this.grad3[gi2+2]*z2)}let t3=0.6-x3*x3-y3*y3-z3*z3;if(t3<0)n3=0.0;else{t3*=t3;n3=t3*t3*(this.grad3[gi3]*x3+this.grad3[gi3+1]*y3+this.grad3[gi3+2]*z3)}return 32.0*(n0+n1+n2+n3)}};return SimplexNoise})();


// --- The Grand Design ---
const simplex = new SimplexNoise();
const canvas = document.getElementById('world-canvas');
const ctx = canvas.getContext('2d');
const h1 = document.querySelector('h1');

// **NEW**: Updated palette with your requested color and high-contrast magic
const PALETTE = {
    sky: '#b3d8ff',
    grass: '#c2e6b8',
    particle: '#18d3f0', // Your requested particle color
    shadow: '#6a8b62',   // Slightly darker shadow for better rune definition
    flower: '#ffffff',
    text: '#4a5c44',
    magic_accent: '#ffee58', // Brighter, more saturated gold
    magic_light: '#fffde7', // Very bright light for discharges
};

// **NEW**: Increased object counts and tuned settings
const settings = {
    conway: { cellSize: 15, updateInterval: 25, spawnChance: 0.80 }, // Denser field
    particles: { count: 250, maxSpeed: 0.8 }, // +25%
    runes: { count: 50 }, // +25%
    spellCircles: { count: 3, frequency: 0.003 },
    flowField: { scale: 35, evolution: 0.0006, strength: 1.5 },
};

let width, height, zOffset, mouse, frameCounter = 0;
let flowField, conwayGrid, elements, spellCircles, effects;

function setup() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    zOffset = Math.random() * 1000;
    mouse = { x: width / 2, y: height / 2, radius: 250 };
    ctx.lineCap = 'round';

    const gridW = Math.floor(width / settings.conway.cellSize);
    const gridH = Math.floor(height / settings.conway.cellSize);
    conwayGrid = new Array(gridH).fill(null).map(() => new Array(gridW).fill(0).map(() => Math.random() > settings.conway.spawnChance ? 1 : 0));
    
    elements = [];
    for (let i = 0; i < settings.particles.count; i++) elements.push(new Element(false));
    for (let i = 0; i < settings.runes.count; i++) elements.push(new Element(true));
    
    spellCircles = Array.from({ length: settings.spellCircles.count }, () => new SpellCircle());
    effects = [];
    
    h1.style.color = PALETTE.text;
}

window.addEventListener('resize', setup);
window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

// --- Procedural Rune Generator (Unchanged) ---
class Rune { /* ... [Same Rune class code as previous response] ... */ constructor(){this.generate()}generate(){this.segments=[];const t=3,e=[];for(let s=0;s<=t;s++)for(let r=0;r<=t;r++)e.push({x:s,y:r});let s=e.splice(Math.floor(Math.random()*e.length),1)[0];let r=Math.floor(2*Math.random())+2;for(let t=0;t<r;t++){if(0===e.length)break;let r=e.splice(Math.floor(Math.random()*e.length),1)[0];this.segments.push({p1:s,p2:r}),s=r}}draw(t,e,s,r,h){t.strokeStyle=h,t.lineWidth=r/5,this.segments.forEach(i=>{t.beginPath(),t.moveTo(e+(i.p1.x/3-.5)*r,s+(i.p1.y/3-.5)*r),t.lineTo(e+(i.p2.x/3-.5)*r,s+(i.p2.y/3-.5)*r),t.stroke()})} }

// --- Element Class (Particles & Runes) - **NEW** Behavior ---
class Element {
    constructor(isRune) { this.isRune = isRune; if (isRune) this.rune = new Rune(); this.reset(); }
    reset() { this.pos = { x: Math.random() * width, y: Math.random() * height }; this.vel = { x: 0, y: 0 }; this.acc = { x: 0, y: 0 }; }
    update() {
        const dx = this.pos.x - mouse.x; const dy = this.pos.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            this.acc.x += (dx / dist) * force * 0.5; this.acc.y += (dy / dist) * force * 0.5;
        }
        this.vel.x += this.acc.x; this.vel.y += this.acc.y;
        const speed = Math.sqrt(this.vel.x * this.vel.x + this.vel.y * this.vel.y);
        if (speed > settings.particles.maxSpeed) { this.vel.x = (this.vel.x / speed) * settings.particles.maxSpeed; this.vel.y = (this.vel.y / speed) * settings.particles.maxSpeed; }
        this.pos.x += this.vel.x; this.pos.y += this.vel.y;
        this.acc = { x: 0, y: 0 };
        this.edges();
    }
    follow(vectors) {
        const x = Math.floor(this.pos.x / settings.flowField.scale);
        const y = Math.floor(this.pos.y / settings.flowField.scale);
        const index = x + y * Math.floor(width / settings.flowField.scale);
        const force = vectors[index];
        if (force) {
            // **NEW**: Runes are much less affected by the wind, preventing clustering
            const forceMultiplier = this.isRune ? 0.01 : 0.05;
            this.acc.x += force.x * forceMultiplier;
            this.acc.y += force.y * forceMultiplier;
        }
    }
    edges() { if (this.pos.x > width) this.pos.x = 0; if (this.pos.x < 0) this.pos.x = width; if (this.pos.y > height) this.pos.y = 0; if (this.pos.y < 0) this.pos.y = height; }
    draw() {
        if (this.isRune) {
            this.rune.draw(ctx, this.pos.x, this.pos.y, 10, `${PALETTE.shadow}99`);
        } else {
            // **NEW**: Uses your requested particle color
            ctx.fillStyle = PALETTE.particle;
            ctx.beginPath();
            ctx.arc(this.pos.x, this.pos.y, 1.5, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

// --- Spell Circle & Effects Classes - **NEW** High-Contrast Colors ---
class SpellCircle {
    constructor() { this.state = 'inactive'; this.durations = { form: 250, pulse: 350, discharge: 40, fizzle: 90 }; }
    start() { /* ... [Same start() method] ... */ this.state="forming",this.pos={x:Math.random()*width,y:Math.random()*height},this.maxRadius=60*Math.random()+50,this.age=0,this.rotation=2*Math.random()*Math.PI }
    update() {
        if (this.state === 'inactive') { if (Math.random() < settings.spellCircles.frequency) this.start(); return; }
        this.age++;
        switch(this.state) {
            case 'forming': if (this.age > this.durations.form) { this.age = 0; this.state = 'pulsing'; } break;
            case 'pulsing': if (this.age > this.durations.pulse) { this.age = 0; this.state = 'discharging'; } break;
            case 'discharging': if (this.age > this.durations.discharge) { effects.push(new DischargeWave(this.pos, this.maxRadius)); this.age = 0; this.state = 'fizzling'; } break;
            case 'fizzling': if (this.age > this.durations.fizzle) { this.state = 'inactive'; } break;
        }
    }
    draw(z) {
        if (this.state === 'inactive') return;
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.rotate(this.rotation + this.age * 0.002);
        
        let lifeRatio, alpha;
        switch(this.state) {
            case 'forming': lifeRatio = this.age / this.durations.form; alpha = lifeRatio; this.drawGlyphCircle(this.maxRadius * lifeRatio, 10, alpha * 0.8, z, lifeRatio * Math.PI * 2); break;
            case 'pulsing':
                const pulse = 0.5 + 0.5 * Math.sin(this.age * 0.05);
                this.drawGlyphCircle(this.maxRadius, 10, 1, z, Math.PI * 2, pulse);
                ctx.fillStyle = `${PALETTE.magic_accent}${Math.floor(pulse * 60 + 20).toString(16).padStart(2, '0')}`;
                ctx.beginPath(); ctx.arc(0, 0, this.maxRadius * 0.8 * pulse, 0, Math.PI * 2); ctx.fill();
                break;
            case 'discharging': alpha = 1 - (this.age / this.durations.discharge); this.drawGlyphCircle(this.maxRadius, 10, alpha, z, Math.PI * 2, 1.5); break;
            case 'fizzling':
                alpha = 1 - (this.age / this.durations.fizzle);
                ctx.globalAlpha = alpha;
                for(let i = 0; i < 20; i++) {
                    const angle = (i / 20) * Math.PI * 2; const fizzleOffset = this.age * 1.5;
                    const x = Math.cos(angle) * (this.maxRadius + fizzleOffset); const y = Math.sin(angle) * (this.maxRadius + fizzleOffset);
                    ctx.fillStyle = PALETTE.magic_light; ctx.beginPath(); ctx.arc(x, y, Math.random() * 1.5, 0, Math.PI*2); ctx.fill();
                }
                ctx.globalAlpha = 1;
                break;
        }
        ctx.restore();
    }
    drawGlyphCircle(radius, numGlyphs, alpha, z, arc = Math.PI * 2, pulse = 1) {
        for (let i = 0; i < numGlyphs; i++) {
            const angle = (i / numGlyphs) * arc; const x = Math.cos(angle) * radius; const y = Math.sin(angle) * radius;
            const noise = simplex.noise3D(x * 0.1, y * 0.1, z);
            if (noise > -0.5) {
                ctx.save(); ctx.translate(x, y); ctx.rotate(angle + Math.PI / 2);
                new Rune().draw(ctx, 0, 0, 12 * pulse, `${PALETTE.magic_accent}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`);
                ctx.restore();
            }
        }
    }
}

class DischargeWave {
    constructor(pos, maxRadius) { this.pos = pos; this.radius = 0; this.maxRadius = maxRadius * 3; this.lifespan = 60; this.age = 0; }
    update() { this.age++; }
    draw() {
        if (this.age > this.lifespan) return;
        const lifeRatio = this.age / this.lifespan;
        this.radius = this.maxRadius * (1 - Math.pow(1 - lifeRatio, 3));
        const alpha = 1 - lifeRatio;
        // **NEW**: High-contrast white light discharge
        ctx.strokeStyle = `${PALETTE.magic_light}${Math.floor(alpha * 220).toString(16).padStart(2, '0')}`;
        ctx.lineWidth = 15 * alpha;
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
        ctx.stroke();
    }
}

// --- Conway & Flow Field Functions (Unchanged) ---
function updateSystems() { /* ... [Same updateSystems() method] ... */ const t=settings.flowField.scale;flowField=new Array(Math.ceil(width/t)*Math.ceil(height/t));let e=0;for(let s=0;s<Math.ceil(height/t);s++){let r=0;for(let h=0;h<Math.ceil(width/t);h++){const o=h+s*Math.ceil(width/t),a=simplex.noise3D(r,e,zOffset)*Math.PI*settings.flowField.strength;flowField[o]={x:Math.cos(a),y:Math.sin(a)},r+=.1}e+=.1}if(frameCounter%settings.conway.updateInterval==0){const t=conwayGrid[0].length,e=conwayGrid.length,s=conwayGrid.map(t=>[...t]);for(let r=0;r<e;r++)for(let h=0;h<t;h++){let o=0;for(let a=-1;a<=1;a++)for(let l=-1;l<=1;l++){if(0===a&&0===l)continue;const i=h+l,n=r+a;i>=0&&i<t&&n>=0&&n<e&&(o+=conwayGrid[n][i])}conwayGrid[r][h]&&(o<2||o>3)?s[r][h]=0:conwayGrid[r][h]||3!==o||(s[r][h]=1)}conwayGrid=s} }
function drawConway() { /* ... [Same drawConway() method] ... */ const t=settings.conway.cellSize;ctx.fillStyle=PALETTE.flower,ctx.shadowColor=PALETTE.sunlight,ctx.shadowBlur=6;for(let e=0;e<conwayGrid.length;e++)for(let s=0;s<conwayGrid[e].length;s++)conwayGrid[e][s]&&(ctx.beginPath(),ctx.arc(s*t+t/2,e*t+t/2,.25*t,0,2*Math.PI),ctx.fill());ctx.shadowBlur=0 }

// --- Main Animation Loop (Unchanged) ---
function animate() {
    zOffset += settings.flowField.evolution;
    frameCounter++;
    updateSystems();

    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, PALETTE.sky);
    gradient.addColorStop(1, PALETTE.grass);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    drawConway();
    
    elements.forEach(el => { el.follow(flowField); el.update(); el.draw(); });
    spellCircles.forEach(sc => { sc.update(); sc.draw(zOffset); });
    effects = effects.filter(e => e.age <= e.lifespan);
    effects.forEach(e => { e.update(); e.draw(); });
    
    requestAnimationFrame(animate);
}

setup();
animate();