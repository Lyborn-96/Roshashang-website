/* =====================================================================
   Roshashang website settings
   ---------------------------------------------------------------------
   WHATSAPP_NUMBER: the number the green WhatsApp button opens.
   Use international format with no +, spaces or leading 0.
   Example: 082 048 5072  ->  '27820485072'
   ===================================================================== */
var WHATSAPP_NUMBER = '27820485072';   // 082 048 5072
var WHATSAPP_MESSAGE = "Hi Roshashang, I'd like a transcription quote";
var MAX_FILE_MB = 10;

(function(){
  // WhatsApp button
  document.querySelectorAll('.wa').forEach(function(a){
    a.href='https://wa.me/'+WHATSAPP_NUMBER.replace(/\D/g,'')+'?text='+encodeURIComponent(WHATSAPP_MESSAGE);
  });

  // Mobile menu
  var burger=document.getElementById('burger'),menu=document.getElementById('menu');
  if(burger){burger.addEventListener('click',function(){var o=menu.classList.toggle('open');burger.setAttribute('aria-expanded',o)})}

  // Copy buttons
  document.querySelectorAll('[data-copy]').forEach(function(b){
    b.addEventListener('click',function(){
      var t=b.getAttribute('data-copy');
      function done(){b.textContent='Copied';setTimeout(function(){b.textContent='Copy'},1400)}
      function sel(){var r=document.createRange();r.selectNodeContents(b.previousElementSibling);var s=getSelection();s.removeAllRanges();s.addRange(r)}
      try{navigator.clipboard.writeText(t).then(done,sel)}catch(e){sel()}
    });
  });

  // Rate card: Roshashang rate sheet, per audio minute
  var RATES={normal:{label:'Normal · 7 working days',rate:25.00},urgent:{label:'Urgent · 3 working days',rate:45.00},extreme:{label:'Extreme urgent / overnight',rate:55.30}};
  function rand(n){return 'R '+n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g,',')}

  var form=document.getElementById('quote');
  if(!form)return;
  var dz=document.getElementById('dz'),fi=document.getElementById('q-file'),dn=document.getElementById('dz-name');
  var svc=document.getElementById('q-svc'),min=document.getElementById('q-min'),tat=document.getElementById('q-tat'),out=document.getElementById('q-est'),estField=document.getElementById('q-estimate');

  dz.addEventListener('click',function(){fi.click()});
  dz.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();fi.click()}});
  ['dragenter','dragover'].forEach(function(ev){dz.addEventListener(ev,function(e){e.preventDefault();dz.classList.add('over')})});
  ['dragleave','drop'].forEach(function(ev){dz.addEventListener(ev,function(e){e.preventDefault();dz.classList.remove('over')})});
  dz.addEventListener('drop',function(e){if(e.dataTransfer.files[0]){fi.files=e.dataTransfer.files;show(fi.files[0])}});
  fi.addEventListener('change',function(){if(fi.files[0])show(fi.files[0])});
  function show(f){
    var mb=f.size/1048576;
    dn.textContent=f.name+' · '+mb.toFixed(1)+' MB'+(mb>MAX_FILE_MB?' — too large to attach. Send the form without it and we will reply with a secure upload link.':'');
    var a=document.createElement('audio');a.preload='metadata';a.src=URL.createObjectURL(f);
    a.onloadedmetadata=function(){if(isFinite(a.duration)&&a.duration>0){min.value=Math.ceil(a.duration/60);est()}};
  }
  function est(){
    var m=parseFloat(min.value),perMin=svc.selectedOptions[0].dataset.perMin==='1';
    if(!perMin){out.innerHTML='<span>This service is quoted per matter.</span><b>On quotation</b>';estField.value='On quotation';return}
    if(!(m>0)){out.innerHTML='<span>Enter the recording length to see an estimate.</span><b>—</b>';estField.value='';return}
    var r=RATES[tat.selectedOptions[0].dataset.k],total=Math.ceil(m)*r.rate;
    out.innerHTML='<span>'+Math.ceil(m)+' audio min × '+rand(r.rate)+' ('+r.label+')</span><b>'+rand(total)+'</b>';
    estField.value=rand(total)+' ('+Math.ceil(m)+' min × '+rand(r.rate)+', '+r.label+')';
  }
  [svc,min,tat].forEach(function(el){el.addEventListener('input',est)});est();

  var msg=document.getElementById('sent'),btn=document.getElementById('q-send');
  var next=document.getElementById('q-next');
  if(next&&location.protocol.indexOf('http')===0){next.value=location.origin+'/thanks'}
  function say(t,err){msg.hidden=false;msg.className='sent'+(err?' err':'');msg.innerHTML=t}
  form.addEventListener('submit',function(e){
    var n=document.getElementById('q-name').value.trim(),m=document.getElementById('q-email').value.trim(),p=document.getElementById('q-popia').checked;
    if(!n||!m||!p){e.preventDefault();say('Please add your name and email, and tick the POPIA consent box, before sending.',true);return}
    var f=fi.files[0];
    if(f&&f.size>MAX_FILE_MB*1048576){e.preventDefault();say('The recording is larger than '+MAX_FILE_MB+' MB. Remove it and send the form, and we will reply with a secure upload link.',true);return}
    document.getElementById('q-subject').value='Quote request: '+svc.value+' ('+n+')';
    est();btn.disabled=true;btn.textContent='Sending…';
  });
})();
