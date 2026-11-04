/* ONELIFE site scripts */
(function(){
  // 漢堡選單
  var bg=document.querySelector('.burger');
  if(bg){bg.addEventListener('click',function(){var o=document.body.classList.toggle('menu-open');bg.setAttribute('aria-expanded',o);bg.setAttribute('aria-label',o?'關閉選單':'開啟選單');});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&document.body.classList.contains('menu-open'))bg.click();});}

  // 表單送到 Google Apps Script（把下面這行換成你部署後的網址）
  var ENDPOINT = window.ONELIFE_FORM_ENDPOINT || '';

  document.querySelectorAll('form.jsform').forEach(function(f){
    f.addEventListener('submit', function(e){
      e.preventDefault();
      var msg = f.querySelector('.msg'); msg.className='msg'; msg.textContent='';
      var bad = Array.prototype.find.call(f.querySelectorAll('[required]'), function(i){ return !i.value.trim() || (i.type==='email' && !/.+@.+\..+/.test(i.value)); });
      if (bad) { msg.className='msg err'; msg.textContent='還有必填欄位沒填好：' + (bad.previousElementSibling ? bad.previousElementSibling.textContent : bad.name); bad.focus(); return; }
      if (f.querySelector('[name=website]').value) return; // 機器人
      var data = {}; new FormData(f).forEach(function(v,k){ if(k!=='website') data[k]=v; });
      data['類型'] = f.dataset.type; data['頁面'] = location.pathname; data['時間'] = new Date().toISOString();
      var btn = f.querySelector('button[type=submit]'); var old = btn.textContent; btn.textContent='送出中…'; btn.disabled=true;
      if (!ENDPOINT) { // 尚未設定後端：改用 mailto 備援
        var body = Object.keys(data).map(function(k){return k+'：'+data[k];}).join('\n');
        location.href = 'mailto:onelifetaiwan@gmail.com?subject=' + encodeURIComponent('[官網] '+f.dataset.type) + '&body=' + encodeURIComponent(body);
        btn.textContent=old; btn.disabled=false; msg.textContent='已幫你開啟郵件，送出即可。'; return;
      }
      fetch(ENDPOINT, { method:'POST', mode:'no-cors', headers:{'Content-Type':'text/plain;charset=utf-8'}, body: JSON.stringify(data) })
        .then(function(){ msg.textContent = f.dataset.type==='需求表' ? '收到了，專案人員會在 1 個工作天內聯繫你。' : (f.dataset.type==='下載PDF' ? '方案 PDF 已寄到你的信箱，請查收（含垃圾郵件匣）。' : '登記成功，開放報名時會第一個通知你。'); f.reset(); })
        .catch(function(){ msg.className='msg err'; msg.textContent='送出失敗，請直接加 LINE @onelife 或來電 0987-678-494。'; })
        .finally(function(){ btn.textContent=old; btn.disabled=false; });
    });
  });

  // 案例篩選
  var fb=document.querySelectorAll('.filter button');
  fb.forEach(function(b){b.addEventListener('click',function(){
    fb.forEach(function(x){x.classList.toggle('on',x===b)});
    var f=b.dataset.f;
    document.querySelectorAll('#caselist .card').forEach(function(c){c.classList.toggle('hide',f!=='all'&&c.dataset.c!==f)});
  })});
})();
