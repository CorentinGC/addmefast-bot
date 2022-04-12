const getRandomProxy = async (speed=10, level="elite", type="https", country="us") => {
    const http = require('http');

    const opts = {
        type,
        format: "json",
        level,
        speed,
        country,
        user_agent: true,
        cookies: true,
        referer: true,
        post: true
    }
    const params = Object.keys(opts).map(e => e+"="+opts[e]).join("&")

    return new Promise((resolve, reject) => {
        http.get(`http://pubproxy.com/api/proxy?${params}`, (resp) => {
            let data = ''
            resp.on('data', (chunk) => data += chunk);
          
            resp.on('end', () => {
                if(data === 'No proxy') reject({error: "No proxy"})
                else {
                    resolve(opts.format === "json" ? JSON.parse(data).data[0] : data)
                    console.log(JSON.parse(data).data[0])
                }
                
            });
          
          })
          .on("error", (err) => {
            console.log("Error: " + err.message);
          });
    })

}
module.exports = {
    getRandomProxy
}