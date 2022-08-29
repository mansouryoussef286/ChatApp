importScripts('./ngsw-worker.js');

// listen on the background sync event after internet connection
self.addEventListener('sync', event=>{
    if(event.tag === 'send-msg'){
        console.log('send msg');
    }
})