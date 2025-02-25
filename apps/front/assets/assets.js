import user_image from './user-image.png';
import code_icon from './code-icon.png';
import code_icon_dark from './code-icon-dark.png';
import edu_icon from './edu-icon.png';
import edu_icon_dark from './edu-icon-dark.png';
import project_icon from './project-icon.png';
import project_icon_dark from './project-icon-dark.png';
import vscode from './vscode.png';
import firebase from './firebase.png';
import figma from './figma.png';
import git from './git.png';
import mongodb from './mongodb.png';
import right_arrow_white from './right-arrow-white.png';
import logo from './logo.png';
import logo_dark from './logo_dark.png';
import mail_icon from './mail_icon.png';
import mail_icon_dark from './mail_icon_dark.png';
import profile_img from './profile-img.png';
import download_icon from './download-icon.png';
import download_icon_dark from './download-icon-dark.png';
import hand_icon from './hand-icon.png';
import header_bg_color from './header-bg-color.png';
import moon_icon from './moon_icon.png';
import sun_icon from './sun_icon.png';
import arrow_icon from './arrow-icon.png';
import arrow_icon_dark from './arrow-icon-dark.png';
import menu_black from './menu-black.png';
import menu_white from './menu-white.png';
import close_black from './close-black.png';
import close_white from './close-white.png';
import web_icon from './web-icon.png';
import mobile_icon from './mobile-icon.png';
import ui_icon from './ui-icon.png';
import graphics_icon from './graphics-icon.png';
import right_arrow from './right-arrow.png';
import send_icon from './send-icon.png';
import right_arrow_bold from './right-arrow-bold.png';
import right_arrow_bold_dark from './right-arrow-bold-dark.png';
import oci from './oci-logo.png';
import docker from './docker.webp';
import postgresql from './postgresql.png';
import kubernetes from './kubernetes.png';

export const assets = {
    user_image,
    code_icon,
    code_icon_dark,
    edu_icon,
    edu_icon_dark,
    project_icon,
    project_icon_dark,
    vscode,
    firebase,
    figma,
    git,
    mongodb,
    right_arrow_white,
    logo,
    logo_dark,
    mail_icon,
    mail_icon_dark,
    profile_img,
    download_icon,
    download_icon_dark,
    hand_icon,
    header_bg_color,
    moon_icon,
    sun_icon,
    arrow_icon,
    arrow_icon_dark,
    menu_black,
    menu_white,
    close_black,
    close_white,
    web_icon,
    mobile_icon,
    ui_icon,
    graphics_icon,
    right_arrow,
    send_icon,
    right_arrow_bold,
    right_arrow_bold_dark,
    oci,
    docker,
    postgresql,
    kubernetes,
};

export const menuData = ['Home', 'About me', 'Services', 'Works', 'Contact me'];

export const headerData = {
    preTitle: 'Hello, I\'m Codelab',
    title: [
        'Full-stack Developer',
        'based in Korea',
    ],
    paragraphs: 'I create responsive websites where technologies meet creativity.',
    link: '/sample-resume.pdf', // TODO: change
    image: assets.profile_img,
}

export const aboutData = {
    preTitle: 'Introduction',
    title: 'About Me',
    paragraphs: 'Design a better architecture based on technical experience.',
    contents: [
        { icon: assets.code_icon, iconDark: assets.code_icon_dark, title: 'Languages & Stacks', description: [
            '[JS/TS] React, Next, Node, Express, Nest JS',
            '[Python] Django, DRF',
        ],},
        { icon: assets.edu_icon, iconDark: assets.edu_icon_dark, title: 'Education', description: 'Bachelor of Arts in Economics' },
        { icon: assets.project_icon, iconDark: assets.project_icon_dark, title: 'Projects', description: 'Built more than 5 projects' }
    ],
    tools: [
        { icon: assets.vscode, title: 'VS Code (IDE)', link: 'https://code.visualstudio.com' }, 
        { icon: assets.oci, title: 'OCI (Cloud)', link: 'https://www.oracle.com/cloud/'},
        { icon: assets.docker, title: 'Docker (Container)', link: 'https://www.docker.com'},
        { icon: assets.kubernetes, title: 'Kubernetes (Container Orchestration)', link: 'https://kubernetes.io'},
        { icon: assets.postgresql, title: 'PostgreSQL (Database)',link: 'https://www.postgresql.org'},
        { icon: assets.git, title: 'Git (Version control)', link: 'https://git-scm.com'},
    ],
    image: assets.user_image,
};

// TODO: change
export const serviceData = {
    preTitle: 'What I Offer',
    title: 'My Services',
    paragraphs: 'I create responsive websites where technologies meet creativity.',
    contents: [
        { icon: assets.web_icon, title: 'Web design', description: 'Web development is the process of building, programming...', link: '' },
        { icon: assets.mobile_icon, title: 'Mobile app', description: 'Mobile app development involves creating software for mobile devices...', link: '' },
        { icon: assets.ui_icon, title: 'UI/UX design', description: 'UI/UX design focuses on creating a seamless user experience...', link: '' },
        { icon: assets.graphics_icon, title: 'Graphics design', description: 'Creative design solutions to enhance visual communication...', link: '' },
     ],
};

// TODO: change
export const workData = {
    preTitle: 'My Portfolio',
    title: 'My Latest Works',
    paragraphs: 'Here are a few projects I\'ve worked on recently.',
    contents: [
        {
            title: 'Frontend project',
            description: 'Web Design ',
            bgImage: '/work-1.png',
            link: 'https://github.com/codelab-kr',
        },
        {
            title: 'Geo based app',
            description: 'Mobile App',
            bgImage: '/work-2.png',
            link: 'https://github.com/codelab-kr',
        },
        {
            title: 'Photography site',
            description: 'Web Design',
            bgImage: '/work-3.png',
            link: 'https://github.com/codelab-kr',
        },
        {
            title: 'UI/UX designing',
            description: 'UI/UX Design',
            bgImage: '/work-4.png',
            link: 'https://github.com/codelab-kr',
        },
    ],
    link: 'https://github.com/codelab-kr',
}


export const contactData = {
    preTitle: 'Get in touch',
    title: 'Contact Me',
    paragraphs: 'Feel free to reach out to me for any questions or opportunities!',
    accessKey: "470bd229-a169-4ed8-aa4f-2add4ba35a64",
};

export const footerData = {
    copyright: '© 2025 Codelab. All rights reserved.',
    email: 'master@code-lab.kr',
    socials: [
        { title: 'Github', link: 'https://github.com/codelab-kr' },
        { title: 'Blog', link: 'https://blog.code-lab.kr'},
    ],
}