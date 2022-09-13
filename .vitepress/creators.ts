const creatorNames = ["nekomeowww", "LittleSound"];

export interface UserAvatar {
  name: string;
  avatar: string;
}

export interface SocialEntry {
  icon: string;
  link: string;
}

export interface Creators {
  avatar: string;
  name: string;
  title?: string;
  org?: string;
  desc?: string;
  links?: SocialEntry[];
}

const creatorAvatars: Record<string, string> = {};

const getAvatarUrl = (name: string) => `https://github.com/${name}.png`;

export const users = creatorNames.reduce((acc, name) => {
  creatorAvatars[name] = getAvatarUrl(name);
  acc.push({ name, avatar: creatorAvatars[name] });
  return acc;
}, [] as UserAvatar[]);

const creators = [
  {
    avatar: creatorAvatars.nekomeowww,
    name: "絢香猫",
    title: "猫音知识库原始创作者",
    desc: "开发者，专注于基础设施维护，数据分析，后端、DevOps 开发",
    links: [
      { icon: "github", link: `https://github.com/nekomeowww` },
      { icon: "twitter", link: `https://twitter.com/ayakaneko` },
    ],
  },
  {
    avatar: creatorAvatars.LittleSound,
    name: "绚香音",
    title: "猫音知识库原始创作者",
    desc: "开源开发者，专注于前端，以及前端相关工具库和工具链开发",
    links: [
      { icon: "github", link: `https://github.com/LittleSound` },
      { icon: "twitter", link: `https://twitter.com/OikawaRizumu` },
    ],
  },
];

export { creators };
