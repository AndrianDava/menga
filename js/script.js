/*
Configuration
------------------------
If something doesn't work, please contact me on Discord (Astronawta#0012).
*/

const config = {
    serverInfo: {
        serverLogoImageFileName: "logo.png", // File name for logo in /images/
        serverName: "Mengs countryside", // Server name
        serverIp: "play.mengs.my.id", // Server IP
        discordServerID: "1294116423647494235" // Discord server ID
    },

    userSKinTypeInAdminTeam: "bust", // Options: [full, bust, head, face, front, frontFull, skin]
    
    atGroupsDefaultColors: {
        leaders: "rgba(255, 124, 124, 0.5)",
        developers: "rgba(230, 83, 0, 0.5)",
        helpers: "rgba(11, 175, 255, 0.5)",
        builders: "rgba(247, 2, 176, 0.5)"
    },

    adminTeamPage: {
        leaders: [
            {
                inGameName: "Davzz",
                rank: "Owner",
                skinUrlOrPathToFile: "",
                rankColor: "rgba(255, 3, 3, 1)"
            },
            {
                inGameName: "Astronavta",
                rank: "Manager",
                skinUrlOrPathToFile: "",
                rankColor: ""
            }
        ],
        developers: [
            {
                inGameName: "Astronavta",
                rank: "Developer",
                skinUrlOrPathToFile: "",
                rankColor: ""
            },
            {
                inGameName: "Astronavta",
                rank: "Webmaster",
                skinUrlOrPathToFile: "",
                rankColor: ""
            }
        ],
        helpers: [
            {
                inGameName: "Astronavta",
                rank: "Helper++",
                skinUrlOrPathToFile: "",
                rankColor: ""
            }
        ],
        builders: [
            {
                inGameName: "Astronavta",
                rank: "Builder++",
                skinUrlOrPathToFile: "",
                rankColor: ""
            }
        ]
    },

    contactPage: {
        email: "astronavta@example.com"
    }
};

/* Mobile navbar */
const navbar = document.querySelector(".navbar");
const navbarLinks = document.querySelector(".links");
const hamburger = document.querySelector(".hamburger");

hamburger.addEventListener("click", () => {
    navbar.classList.toggle("active");
    navbarLinks.classList.toggle("active");
});

/* FAQs */
const accordionItemHeaders = document.querySelectorAll(".accordion-item-header");

accordionItemHeaders.forEach(header => {
    header.addEventListener("click", () => {
        header.classList.toggle("active");
        const body = header.nextElementSibling;

        if (header.classList.contains("active")) {
            body.style.maxHeight = body.scrollHeight + "px";
        } else {
            body.style.maxHeight = "0px";
        }
    });
});

/* Config navbar & header */
const serverName = document.querySelector(".server-name");
const serverLogo = document.querySelector(".logo-img");
const serverIp = document.querySelector(".minecraft-server-ip");
const serverLogoHeader = document.querySelector(".logo-img-header");
const discordOnlineUsers = document.querySelector(".discord-online-users");
const minecraftOnlinePlayers = document.querySelector(".minecraft-online-players");

/* Config contact */
const contactForm = document.querySelector(".contact-form");
const inputWithLocationAfterSubmit = document.querySelector(".location-after-submit");

const getDiscordOnlineUsers = async () => {
    try {
        const response = await fetch(`https://discord.com/api/guilds/${config.serverInfo.discordServerID}/widget.json`);
        const data = await response.json();
        return data.presence_count || "None";
    } catch (e) {
        return "None";
    }
};

const getMinecraftOnlinePlayer = async () => {
    try {
        const response = await fetch(`https://api.mcsrvstat.us/2/${config.serverInfo.serverIp}`);
        const data = await response.json();
        return data.players.online || "None";
    } catch (e) {
        console.log(e);
        return "None";
    }
};

const getUuidByUsername = async (username) => {
    try {
        const response = await fetch(`https://api.minetools.eu/uuid/${username}`);
        const data = await response.json();
        return data.id || "None";
    } catch (e) {
        console.log(e);
        return "None";
    }
};

const getSkinByUuid = async (username) => {
    try {
        const uuid = await getUuidByUsername(username);
        return `https://visage.surgeplay.com/${config.userSKinTypeInAdminTeam}/512/${uuid}`;
    } catch (e) {
        console.log(e);
        return "None";
    }
};

const copyIp = () => {
    const copyIpButton = document.querySelector(".copy-ip");
    const copyIpAlert = document.querySelector(".ip-copied");

    copyIpButton.addEventListener("click", () => {
        try {
            navigator.clipboard.writeText(config.serverInfo.serverIp);
            copyIpAlert.classList.add("active");

            setTimeout(() => {
                copyIpAlert.classList.remove("active");
            }, 5000);
        } catch (e) {
            console.log(e);
            copyIpAlert.innerHTML = "An error has occurred!";
            copyIpAlert.classList.add("active", "error");

            setTimeout(() => {
                copyIpAlert.classList.remove("active", "error");
            }, 5000);
        }
    });
};

const setDataFromConfigToHtml = async () => {
    /* Set config data to navbar */
    if (serverName) serverName.innerHTML = config.serverInfo.serverName;
    if (serverLogo) serverLogo.src = `images/${config.serverInfo.serverLogoImageFileName}`;

    /* Set config data to header */
    if (serverIp) serverIp.innerHTML = config.serverInfo.serverIp;

    let locationPathname = location.pathname;

    if (locationPathname == "/" || locationPathname.includes("index")) {
        copyIp();
        if (serverLogoHeader) serverLogoHeader.src = `images/${config.serverInfo.serverLogoImageFileName}`;
        if (discordOnlineUsers) discordOnlineUsers.innerHTML = await getDiscordOnlineUsers();
        if (minecraftOnlinePlayers) minecraftOnlinePlayers.innerHTML = await getMinecraftOnlinePlayer();
    } else if (locationPathname.includes("admin-team")) {
        const atContent = document.querySelector(".at-content");
        
        for (let team in config.adminTeamPage) {
            const group = document.createElement("div");
            group.classList.add("group", team);
            group.innerHTML = `<h2 class="rank-title">${team.charAt(0).toUpperCase() + team.slice(1)}</h2><div class="users"></div>`;
            atContent.appendChild(group);

            for (let user of config.adminTeamPage[team]) {
                let userSkin = user.skinUrlOrPathToFile || await getSkinByUuid(user.inGameName);
                let rankColor = user.rankColor || config.atGroupsDefaultColors[team];

                const userDiv = document.createElement("div");
                userDiv.classList.add("user");
                userDiv.innerHTML = `<img src="${userSkin}" alt="${user.inGameName}"><h5 class="name">${user.inGameName}</h5><p class="rank ${team}" style="background: ${rankColor}">${user.rank}</p>`;
                
                group.querySelector(".users").appendChild(userDiv);
            }
        }
    } else if (locationPathname.includes("contact")) {
        if (contactForm) contactForm.action = `https://formsubmit.co/${config.contactPage.email}`;
        if (inputWithLocationAfterSubmit) inputWithLocationAfterSubmit.value = location.href;
    }
};

setDataFromConfigToHtml();
