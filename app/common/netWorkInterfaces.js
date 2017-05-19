/**
 * Created by xwatson on 2017/5/20.
 */

const os = require('os')

exports.getIp = () => {
    const ifaces = os.networkInterfaces();
    let address = ''
    Object.keys(ifaces).forEach(function (ifname) {
        var alias = 0;

        ifaces[ifname].forEach(function (iface) {
            if ('IPv4' !== iface.family || iface.internal !== false) {
                // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
                return
            }

            if (alias >= 1) {
                // this single interface has multiple ipv4 addresses
                console.log(ifname + ':' + alias, iface.address)
                address = iface.address
            } else {
                // this interface has only one ipv4 adress
                console.log(ifname, iface.address)
                address = iface.address
            }
            ++alias;
        });
    });
    return address
}