export function generateResumeHTML(resumeData) {
  const {
    name,
    birthDate,
    email,
    phone,
    bio,
    zodiac,
    experience = [],
    education = [],
    skills = [],
    theme = 'slate'
  } = resumeData;

  const experienceHTML = experience.map((exp, idx) => `
    <div class="timeline-item">
      <div class="flex items-baseline justify-between flex-wrap gap-2">
        <h3 class="font-semibold text-slate-800 text-base">${exp.company || ''}</h3>
        <span class="font-mono text-xs text-slate-500">${exp.startDate || ''} — ${exp.endDate || '至今'}</span>
      </div>
      <p class="text-xs text-slate-600 mt-0.5 mb-3">${exp.position || ''}</p>
      <ul class="text-sm text-slate-700 opacity-85 space-y-2 list-none">
        ${exp.achievements?.map(ach => `<li>— ${ach}</li>`).join('') || ''}
      </ul>
    </div>
  `).join('');

  const educationHTML = education.map(edu => `
    <div class="flex items-start justify-between gap-4 flex-wrap">
      <div>
        <h3 class="font-semibold text-slate-800 text-sm">${edu.school || ''}</h3>
        <p class="text-xs text-slate-600 mt-0.5">${edu.degree || ''}</p>
      </div>
      <span class="font-mono text-xs text-slate-500 whitespace-nowrap">${edu.startDate || ''} — ${edu.endDate || ''}</span>
    </div>
  `).join('');

  const skillsHTML = skills.map(skill => `
    <span class="tag">${skill}</span>
  `).join('');

  const zodiacInfo = zodiac || { name: '射手座', symbol: '♐' };

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${name} · 个人简历</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@300;400;600;700&family=DM+Mono:wght@300;400;500&family=Playfair+Display:wght@400;700&display=swap" rel="stylesheet" />
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            slate: {
              50: '#f8fafc',
              100: '#f1f5f9',
              200: '#e2e8f0',
              300: '#cbd5e1',
              400: '#94a3b8',
              500: '#64748b',
              600: '#475569',
              700: '#334155',
              800: '#1e293b',
              900: '#0f172a',
            }
          },
          fontFamily: {
            serif: ['"Noto Serif SC"', 'serif'],
            mono: ['"DM Mono"', 'monospace'],
            display: ['"Playfair Display"', 'serif'],
          },
        }
      }
    }
  </script>
  <style>
    * { box-sizing: border-box; }
    body {
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      color: #1e293b;
      font-family: 'Noto Serif SC', serif;
    }

    #3d-background {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.4;
    }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(18px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .fade-up { animation: fadeUp .55s cubic-bezier(.22,.68,0,1.2) both; }
    .delay-1 { animation-delay: .08s; }
    .delay-2 { animation-delay: .16s; }
    .delay-3 { animation-delay: .24s; }
    .delay-4 { animation-delay: .32s; }
    .delay-5 { animation-delay: .40s; }
    .delay-6 { animation-delay: .48s; }

    .timeline-item { position: relative; padding-left: 1.5rem; }
    .timeline-item::before {
      content: '';
      position: absolute;
      left: 0; top: .45rem;
      width: 6px; height: 6px;
      background: #64748b;
      border-radius: 50%;
    }
    .timeline-item::after {
      content: '';
      position: absolute;
      left: 2.5px; top: 1.1rem;
      width: 1px;
      bottom: 0;
      background: #e2e8f0;
    }
    .timeline-item:last-child::after { display: none; }

    .tag {
      display: inline-block;
      font-family: 'DM Mono', monospace;
      font-size: .72rem;
      letter-spacing: .04em;
      padding: .3rem .75rem;
      border-radius: 3px;
      background: #f1f5f9;
      color: #475569;
      border: 1px solid #e2e8f0;
    }

    .section-label {
      font-family: 'DM Mono', monospace;
      font-size: .65rem;
      letter-spacing: .15em;
      text-transform: uppercase;
      color: #94a3b8;
    }

    hr.rule { border-color: #e2e8f0; }

    .glass-card {
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(226, 232, 240, 0.5);
    }

    .zodiac-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
      border-radius: 4px;
      font-size: 0.85rem;
      color: #475569;
    }

    .stat-card {
      border-left: 3px solid #64748b;
      padding-left: 1rem;
    }

    @media print {
      body { background: white; }
      #3d-background { display: none; }
    }
  </style>
</head>
<body class="min-h-screen py-10 px-4">

  <canvas id="3d-background"></canvas>

  <div class="max-w-4xl mx-auto glass-card shadow-2xl rounded-lg overflow-hidden">

    <header class="px-12 pt-12 pb-10 fade-up" style="border-bottom: 2px solid #e2e8f0;">
      <div class="flex items-end justify-between gap-6 flex-wrap">
        <div>
          <p class="section-label mb-3">Executive Profile</p>
          <h1 class="font-display text-5xl font-bold text-slate-800 leading-none tracking-tight">
            ${name}
          </h1>
          <p class="mt-3 text-slate-600 text-sm font-mono tracking-wide">${email} · ${phone || 'N/A'}</p>
          <div class="mt-4">
            <span class="zodiac-badge">
              ${zodiacInfo.symbol} ${zodiacInfo.name}
            </span>
          </div>
        </div>

        <div class="text-right space-y-1 text-sm text-slate-600 font-mono">
          <div>${new Date(birthDate).toLocaleDateString('zh-CN')}</div>
          <div class="flex items-center justify-end">
            <span class="tag mt-2">Generated Resume</span>
          </div>
        </div>
      </div>

      <p class="mt-8 text-base leading-relaxed text-slate-700 max-w-3xl opacity-85">
        ${bio || ''}
      </p>
    </header>

    <div class="px-12 py-12 space-y-12">

      <section class="fade-up delay-1">
        <p class="section-label mb-4">关于</p>
        <p class="text-sm leading-7 text-slate-700 opacity-90">
          ${bio || '暂无简介'}
        </p>
      </section>

      <hr class="rule" />

      ${experience.length > 0 ? `
      <section class="fade-up delay-2">
        <p class="section-label mb-6">职业经历</p>
        <div class="space-y-8">
          ${experienceHTML}
        </div>
      </section>

      <hr class="rule" />
      ` : ''}

      ${education.length > 0 ? `
      <section class="fade-up delay-3">
        <p class="section-label mb-6">教育背景</p>
        <div class="space-y-5">
          ${educationHTML}
        </div>
      </section>

      <hr class="rule" />
      ` : ''}

      ${skills.length > 0 ? `
      <section class="fade-up delay-5">
        <p class="section-label mb-4">核心能力</p>
        <div class="flex flex-wrap gap-3">
          ${skillsHTML}
        </div>
      </section>
      ` : ''}

    </div>

    <footer class="px-12 py-8 flex items-center justify-between flex-wrap gap-4" style="border-top: 2px solid #e2e8f0; background: #f8fafc;">
      <span class="font-mono text-xs text-slate-600">© 2024 · ${name} · 个人简历</span>
      <span class="font-mono text-xs text-slate-400">Created with Resume Builder</span>
    </footer>

  </div>

  <script>
    function initThreeJS() {
      const canvas = document.getElementById('3d-background');
      if (!canvas) return;
      
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0x000000, 0);
      camera.position.z = 5;

      const geometry1 = new THREE.IcosahedronGeometry(1, 4);
      const material1 = new THREE.MeshPhongMaterial({ 
        color: 0x64748b, 
        emissive: 0x374151,
        wireframe: true 
      });
      const shape1 = new THREE.Mesh(geometry1, material1);
      shape1.position.x = -3;
      scene.add(shape1);

      const geometry2 = new THREE.OctahedronGeometry(1.2, 2);
      const material2 = new THREE.MeshPhongMaterial({ 
        color: 0x94a3b8, 
        emissive: 0x475569,
        wireframe: false 
      });
      const shape2 = new THREE.Mesh(geometry2, material2);
      shape2.position.x = 3;
      shape2.position.y = 1;
      scene.add(shape2);

      const geometry3 = new THREE.TorusGeometry(1.5, 0.4, 8, 60);
      const material3 = new THREE.MeshPhongMaterial({ 
        color: 0xbfdbfe,
        emissive: 0x0f172a,
        wireframe: true 
      });
      const shape3 = new THREE.Mesh(geometry3, material3);
      shape3.position.y = -1;
      scene.add(shape3);

      const light1 = new THREE.DirectionalLight(0xffffff, 0.6);
      light1.position.set(5, 5, 5);
      scene.add(light1);

      const light2 = new THREE.PointLight(0x94a3b8, 0.4);
      light2.position.set(-5, -5, 5);
      scene.add(light2);

      const animate = () => {
        requestAnimationFrame(animate);
        shape1.rotation.x += 0.001;
        shape1.rotation.y += 0.002;
        shape2.rotation.y += 0.0015;
        shape2.rotation.z += 0.001;
        shape3.rotation.x += 0.0008;
        shape3.rotation.y += 0.002;
        renderer.render(scene, camera);
      };

      animate();

      window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      });
    }

    document.addEventListener('DOMContentLoaded', initThreeJS);
  </script>

</body>
</html>`;
}
