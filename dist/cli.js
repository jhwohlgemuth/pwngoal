"use strict";var _chalk=require("chalk");Object.defineProperty(exports,"__esModule",{value:!0}),exports.options=exports.help=exports.descriptions=exports.projectName=void 0;const projectName="pwngoal";exports.projectName="pwngoal";const descriptions={default:a=>`Execute for ${a}`,enum:"Enumerate stuff",scan:"Scan stuff",port:`Scan a port with nmap`,ports:`Perform a full TCP port scan with masscan (or nmap)`,"reverse shell (php)":`Copy one-line reverse shell written in ${_chalk.bold.magenta("PHP")}`,"reverse shell (python)":`Copy one-line reverse shell written in ${_chalk.bold.yellow("Python")}`,"reverse shell (perl)":`Copy one-line reverse shell written in ${_chalk.bold.blue("Perl")}`,"reverse shell (ruby)":`Copy one-line reverse shell written in ${_chalk.bold.red("Ruby")}`,"reverse shell (bash)":`Copy one-line reverse shell written in ${_chalk.bold.bgBlack.white(" Bash ")}`,"reverse shell (awk)":`Copy one-line reverse shell written in ${_chalk.bold.bgBlack.white(" awk ")}`,"find files/folders with write access (linux)":`Find locations with ${(0,_chalk.bold)("write")} access during Linux ${_chalk.bold.cyan("privilege escalation")}`,"spawn a TTY shell (linux)":`Spawn a TTY shell with ${_chalk.bold.yellow("Python")}`};exports.descriptions=descriptions;const help=`
    ${_chalk.dim.bold("Usage")}

        ${(0,_chalk.cyan)(">")} ${"pwngoal"} [commands] [terms] [options]
        
        ${(0,_chalk.cyan)(">")} ${"pwngoal"} version


    ${_chalk.dim.bold("Commands")}

        backup, copy, scan, show, suggest, version, wat


    ${_chalk.dim.bold("Terms")}

        [???]
        ???, ...


    ${_chalk.dim.bold("Options")}

        --version, -v           Print version
        --ignore-warnings,      Ignore warning messages [Default: false]
        --debug                 Show debug data [Default: false]
        --escaped           -e  Wrap copy command in quotes, escape internal quotes [Default: false]
        --ip,               -i  IP address
        --port,             -p  Port [Default: 80]
        --service,          -s  Service
        --udp               -u  Include UDP ports in scan [Default: false]
        --udp-only              Only scan UDP ports [Default: false]
        --user                  User name for functions that need it [Default: 'user']
        --group                 Group name for functions that need it [Default: 'user']
        --output            -o  Path to output directory when backing up data [Default: cwd]
`;exports.help=help;const options={help,flags:{version:{type:"boolean",default:!1,alias:"v"},help:{type:"boolean",default:!1,alias:"h"},ignoreWarnings:{type:"boolean",default:!1},debug:{type:"boolean",default:!1},escaped:{type:"boolean",default:!1,alias:"e"},ip:{type:"string",default:"",alias:"i"},port:{type:"number",default:80,alias:"p"},service:{type:"string",default:"",alias:"s"},udp:{type:"boolean",default:!1,alias:"u"},udpOnly:{type:"boolean",default:!1},user:{type:"string",default:"USER"},group:{type:"string",default:"GROUP"},output:{type:"string",default:process.cwd(),alias:"o"}}};exports.options=options;