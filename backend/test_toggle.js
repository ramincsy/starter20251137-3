// test_toggle.js
// Simple test: login, toggle show_mobile for an employee, then fetch employee list to verify
const API = 'http://localhost:3001';

async function run(){
  try{
    // login
    const loginRes = await fetch(`${API}/api/auth/login`, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({username:'admin', password:'admin123'})
    });
    const loginJson = await loginRes.json();
    if(!loginRes.ok){
      console.error('Login failed', loginJson);
      process.exit(1);
    }
    const token = loginJson.token;
    console.log('Got token');

    // pick an employee id from DB; use 138 if exists
    const employeeId = 138;

    // fetch current employee data
    const listRes1 = await fetch(`${API}/api/admin/employees`, {headers:{Authorization:`Bearer ${token}`}});
    const employees1 = await listRes1.json();
    const empBefore = employees1.find(e=>e.id===employeeId);
    console.log('Before:', empBefore ? {id: empBefore.id, show_mobile: empBefore.show_mobile, show_email: empBefore.show_email} : 'not found');

    // toggle mobile to 0
    const patchRes = await fetch(`${API}/api/admin/employees/${employeeId}/toggle-mobile`, {
      method:'PATCH',
      headers:{'Content-Type':'application/json', Authorization:`Bearer ${token}`},
      body: JSON.stringify({show_mobile: 0})
    });
    const patchJson = await patchRes.json();
    console.log('Patch response:', patchRes.status, patchJson && (patchJson.show_mobile || patchJson));

    // fetch again
    const listRes2 = await fetch(`${API}/api/admin/employees`, {headers:{Authorization:`Bearer ${token}`}});
    const employees2 = await listRes2.json();
    const empAfter = employees2.find(e=>e.id===employeeId);
    console.log('After:', empAfter ? {id: empAfter.id, show_mobile: empAfter.show_mobile, show_email: empAfter.show_email} : 'not found');

    // restore mobile to 1
    await fetch(`${API}/api/admin/employees/${employeeId}/toggle-mobile`, {
      method:'PATCH',
      headers:{'Content-Type':'application/json', Authorization:`Bearer ${token}`},
      body: JSON.stringify({show_mobile: 1})
    });

    process.exit(0);
  }catch(err){
    console.error('Error', err);
    process.exit(1);
  }
}

run();
