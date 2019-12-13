pwngoal
=======
[![npm](https://img.shields.io/npm/v/pwngoal?style=for-the-badge)](https://www.npmjs.com/package/pwngoal) 
[![Travis (.org)](https://img.shields.io/travis/jhwohlgemuth/pwngoal?style=for-the-badge)](https://travis-ci.org/jhwohlgemuth/pwngoal) 
[![Codecov](https://img.shields.io/codecov/c/github/jhwohlgemuth/pwngoal?style=for-the-badge)](https://codecov.io/gh/jhwohlgemuth/pwngoal) 
[![Snyk Vulnerabilities for GitHub Repo](https://img.shields.io/snyk/vulnerabilities/github/jhwohlgemuth/pwngoal?style=for-the-badge)](https://snyk.io/test/github/jhwohlgemuth/pwngoal?targetFile=package.json) 

> A CLI tool to help you scan, enumerate, escalate and...PWN (legally of course)

Install
-------
> [node](https://nodejs.org/en/) required

```bash
npm install --global pwngoal
```

No Install Usage
----------------
> [node](https://nodejs.org/en/) still required

```bash
npx pwngoal -h
```

What can you do with `pwngoal`?
-------------------------------
Generally, `pwngoal` will help you enumerate servers and keep track of your progress...also, it lets you copy commands for easy use.

Specifically, `pwngoal` lets you
- Scan TCP and UDP ports with [`masscan`](https://tools.kali.org/information-gathering/masscan) and/or  [`nmap`](https://nmap.org/)
- Analyze services on open ports with [`nmap`](https://nmap.org/) and [`amap`](https://tools.kali.org/information-gathering/amap) *automagically*
- Save results for export and review
- Easily display results in the console, neatly organized in nice tables
- Copy useful commands to your clipboard for easy access (parameterized with options passed via the command line)

See the available commands with `pwngoal -h`



"pwngoal"?
----------
> “A goal is not always meant to be [PWNed], it often serves simply as something to aim at.”(*edited*) 
―**Bruce Lee**


> “Perhaps when we find ourselves [PWNing] everything, it is because we are dangerously close to [PWNing] nothing.”(*edited*) 
―**Sylvia Plath**


> “I love the challenge of starting at zero every day and seeing how much I can accomplish.”(*edited*)  
―**Martha Stewart**

Also, make sure you don't score an [OWN GOAL!?!?](https://www.youtube.com/watch?v=tafCE6GJrhQ&lc=UgwiQuy3c7rt2Kj6gMl4AaABAg)