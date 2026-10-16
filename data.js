export const SHOWS = {'better-smb':'The Better SMB Podcast',moments:'Better Business Moments'};
export const METRICS = ['plays','downloads','followers','listeners','engaged_listeners','consumption'];
export function parseCSV(text) {
  text=text.replace(/^\uFEFF/,''); const delimiter=text.split(/\r?\n/)[0].includes('\t')?'\t':',';
  const rows=[]; let row=[],cell='',quoted=false;
  for(let i=0;i<text.length;i++){const c=text[i]; if(c==='"'){if(quoted&&text[i+1]==='"'){cell+='"';i++;}else if(quoted||cell==='')quoted=!quoted;else throw Error('Unexpected quote in CSV.');}
    else if(c===delimiter&&!quoted){row.push(cell);cell='';}
    else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&text[i+1]==='\n')i++;row.push(cell);if(row.some(x=>x.trim()))rows.push(row);row=[];cell='';}else cell+=c;}
  if(quoted)throw Error('The CSV has an unclosed quote.');row.push(cell);if(row.some(x=>x.trim()))rows.push(row);
  if(rows.length<2)throw Error('Include a header and at least one data row.');
  const headers=rows.shift().map(x=>x.trim().toLowerCase()); if(new Set(headers).size!==headers.length)throw Error('CSV column names must be unique.');
  return {headers,rows:rows.map((r,i)=>{if(r.length!==headers.length)throw Error(`Row ${i+2}: wrong number of columns.`);return Object.fromEntries(headers.map((h,j)=>[h,r[j].trim()]));})};
}
export function validate(rows){
 if(!Array.isArray(rows)||!rows.length)throw Error('No records found.');if(rows.length>50000)throw Error('Use fewer than 50,000 records per import.');
 return rows.map((r,i)=>{const fail=m=>{throw Error(`Record ${i+1}: ${m}`);};
 if(!/^\d{4}-\d{2}-\d{2}$/.test(r.date)||!Number.isFinite(Date.parse(r.date))||new Date(r.date).toISOString().slice(0,10)!==r.date)fail('use a valid YYYY-MM-DD date.');
 if(!SHOWS[r.show])fail('show must be better-smb or moments.');if(!['spotify','apple','host'].includes(r.platform))fail('platform must be spotify, apple or host.');
 if(!METRICS.includes(r.metric))fail('unknown metric.');if(r.metric==='downloads'&&r.platform!=='host')fail('downloads belong to host (all platforms).');if(r.platform==='host'&&r.metric!=='downloads')fail('host supports downloads only.');
 if(r.value===null||r.value===undefined||String(r.value).trim()==='')fail('value is missing. Leave missing metrics out of the file.');
 const value=Number(String(r.value).replace(/,/g,''));if(!Number.isFinite(value)||value<0)fail('value must be a non-negative number.');if(r.metric!=='consumption'&&!Number.isInteger(value))fail('counts must be whole numbers.');
 if(r.metric==='followers'&&r.episode)fail('followers must be a show-level snapshot.');
 return {date:r.date,show:r.show,platform:r.platform,metric:r.metric,value,episode:String(r.episode||'').trim().slice(0,500)};
 });
}
export const key = r=>JSON.stringify([r.date,r.show,r.platform,r.metric,r.episode||'']);
export function merge(old,rows){const m=new Map(old.map(r=>[key(r),r]));rows.forEach(r=>m.set(key(r),r));return [...m.values()].sort((a,b)=>a.date.localeCompare(b.date));}
export function total(rows,metric,platform){const a=rows.filter(r=>r.metric===metric&&r.platform===platform&&!r.episode);return a.length?a.reduce((s,r)=>s+r.value,0):null;}
export function snapshot(rows,metric,platform){const groups=new Map();rows.filter(r=>r.metric===metric&&r.platform===platform&&!r.episode).forEach(r=>{if(!groups.has(r.show)||groups.get(r.show).date<r.date)groups.set(r.show,r);});return groups.size?{value:[...groups.values()].reduce((s,r)=>s+r.value,0),date:[...groups.values()].map(r=>r.date).sort()[0],shows:groups.size}:null;}
export function demo(){const rows=[],now=new Date();const end=new Date(Date.UTC(now.getUTCFullYear(),now.getUTCMonth(),now.getUTCDate()-1));for(let d=0;d<56;d++){const date=new Date(end.getTime()-(55-d)*86400000).toISOString().slice(0,10);for(const [s,show] of Object.keys(SHOWS).entries()){for(const [p,platform] of ['spotify','apple'].entries()){const plays=Math.round(20+s*12+p*8+d*.9+12*Math.sin(d*.8+s)+((d%7===2)?50:0));rows.push({date,show,platform,metric:'plays',value:plays,episode:''},{date,show,platform,metric:'followers',value:140+s*50+p*35+d*3,episode:''},{date,show,platform,metric:'listeners',value:Math.round(plays*.7),episode:''});for(let e=0;e<4;e++)rows.push({date,show,platform,metric:'plays',value:Math.round(plays*[.4,.3,.2,.1][e]),episode:['Designing a business worth backing','Leadership that lifts performance','Turning insight into action','Building beyond the owner'][e]});}rows.push({date,show,platform:'host',metric:'downloads',value:80+d+s*10,episode:''});}}return rows;}
