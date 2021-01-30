"use strict";var _chalk=require("chalk");Object.defineProperty(exports,"__esModule",{value:!0}),exports.options=exports.help=exports.descriptions=exports.namespace=void 0;const namespace="pwngoal";exports.namespace="pwngoal";const descriptions={default:a=>`Execute for ${a}`,enum:"Enumerate stuff",scan:"Scan stuff",port:`Scan a port with nmap`,ports:`Perform a full TCP port scan with masscan (or nmap)`,"reverse shell (php)":`Copy one-line reverse shell written in ${_chalk.bold.magenta("PHP")}`,"reverse shell (python)":`Copy one-line reverse shell written in ${_chalk.bold.yellow("Python")}`,"reverse shell (perl)":`Copy one-line reverse shell written in ${_chalk.bold.blue("Perl")}`,"reverse shell (ruby)":`Copy one-line reverse shell written in ${_chalk.bold.red("Ruby")}`,"reverse shell (bash)":`Copy one-line reverse shell written in ${_chalk.bold.bgBlack.white(" Bash ")}`,"reverse shell (awk)":`Copy one-line reverse shell written in ${_chalk.bold.bgBlack.white(" awk ")}`,"find files/folders with write access (linux)":`Find locations with ${(0,_chalk.bold)("write")} access during Linux ${_chalk.bold.cyan("privilege escalation")}`,"spawn a TTY shell (linux)":`Spawn a TTY shell with ${_chalk.bold.yellow("Python")}`};exports.descriptions=descriptions;const help=`
    ${_chalk.dim.bold("Usage")}

        ${(0,_chalk.cyan)(">")} ${"pwngoal"} [commands] [terms] [options]

        ${(0,_chalk.cyan)(">")} pwn [commands] [terms] [options]

    ${_chalk.dim.bold("Commands")}

        backup, clear, copy, help, scan, show, suggest, version, wat

        ${_chalk.bold.magenta("TIP:")} ${(0,_chalk.bold)("wat")} is an alias for ${(0,_chalk.bold)("suggest")}

    ${_chalk.dim.bold("Options")}

        --version, -v           Print version
        --ignore-warnings,      Ignore warning messages [Default: false]
        --debug                 Show debug data [Default: false]
        --escaped           -e  Wrap copy command in quotes, escape internal quotes [Default: false]
        --ip,               -i  IP address of target, sometimes referred to as RHOST
        --port,             -p  Port [Default: $RPORT]
        --network-interface -I  Network interface (like eth0 or fxp1) [Default: tap0]
        --service,          -s  Service
        --udp               -u  Include UDP ports in scan [Default: false]
        --udp-only              Only scan UDP ports [Default: false]
        --nmap-only             Use nmap only, even if masscan is available [Default: false]
        --user                  User name for functions that need it [Default: 'user']
        --group                 Group name for functions that need it [Default: 'user']
        --output            -o  Path to output directory when backing up data [Default: cwd]

        ${_chalk.bold.magenta("TIP:")} set your interface with ${(0,_chalk.bold)("--network-interface")} when you want to use masscan

    ${_chalk.dim.bold("Examples")}

        ${(0,_chalk.dim)("Scan open TCP ports, enumerate services")}
        ${(0,_chalk.cyan)(">")} ${"pwngoal"} scan ports -i IP [--nmap-only]

        ${(0,_chalk.dim)("Scan open TCP and UDP ports, enumerate services")}
        ${(0,_chalk.cyan)(">")} ${"pwngoal"} scan ports -i IP --udp

        ${(0,_chalk.dim)("Scan open UDP ports only, enumerate services")}
        ${(0,_chalk.cyan)(">")} ${"pwngoal"} scan ports -i IP --udp-only

        ${(0,_chalk.dim)("Select a command to be copied to your clipboard")}
        ${(0,_chalk.cyan)(">")} ${"pwngoal"} copy [-i IP | -p PORT | --user USER | --group GROUP | --escaped]

        ${(0,_chalk.dim)("View suggestions for PWNing http")}
        ${(0,_chalk.cyan)(">")} ${"pwngoal"} suggest -s http [-i HOST | -p PORT | --user USER | --group GROUP]

        ${(0,_chalk.dim)("Display scan results in a neatly organized table, right in your terminal")}
        ${(0,_chalk.cyan)(">")} ${"pwngoal"} show [-i IP]


`;exports.help=help;const options={help,flags:{version:{type:"boolean",default:!1,alias:"v"},help:{type:"boolean",default:!1,alias:"h"},ignoreWarnings:{type:"boolean",default:!1},debug:{type:"boolean",default:!1},escaped:{type:"boolean",default:!1,alias:"e"},ip:{type:"string",default:"",alias:"i"},port:{type:"string",default:"$RPORT",alias:"p"},networkInterface:{type:"string",default:"tap0",alias:"I"},service:{type:"string",default:"",alias:"s"},udp:{type:"boolean",default:!1,alias:"u"},udpOnly:{type:"boolean",default:!1},nmapOnly:{type:"boolean",default:!1},user:{type:"string",default:"USER"},group:{type:"string",default:"GROUP"},output:{type:"string",default:process.cwd(),alias:"o"}}};exports.options=options;