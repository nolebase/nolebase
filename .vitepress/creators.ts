<<<<<<< HEAD
const creatorNames = ['Lercel']

export interface UserAvatar {
  name: string
  avatar: string
}

=======
>>>>>>> 1276f4089ed8d373ece5e450097ec954a9a5967b
export interface SocialEntry {
  type: 'github' | 'twitter' | 'email'
  icon: string
  link: string
}

export interface Creator {
  avatar: string
  name: string
  username?: string
  title?: string
  org?: string
  desc?: string
  links?: SocialEntry[]
  nameAliases?: string[]
  emailAliases?: string[]
}

const getAvatarUrl = (name: string) => `https://github.com/${name}.png`

export const creators: Creator[] = [
  {
<<<<<<< HEAD
    name: '超级小镇',
    avatar: creatorAvatars.Lercel,
    title: '作者',
    desc: '产品、设计师、开发者',
=======
    name: '絢香猫',
    avatar: '',
    username: 'nekomeowww',
    title: 'Nólëbase 原始创作者',
    desc: '开发者，专注于基础设施维护，数据分析，后端、DevOps 开发',
>>>>>>> 1276f4089ed8d373ece5e450097ec954a9a5967b
    links: [
      { type: 'github', icon: 'github', link: 'https://github.com/lercel' },
    ],
<<<<<<< HEAD
    nameAliases: ['刘俊', 'lercel'],
    emailAliases: ['olj@outlook.com'],
=======
    nameAliases: ['nekomeowww', '绚香猫', '絢香猫', 'Neko Ayaka', 'Ayaka Neko'],
    emailAliases: ['neko@ayaka.moe'],
  },
  {
    name: '絢香音',
    avatar: '',
    username: 'LittleSound',
    title: 'Nólëbase 原始创作者',
    desc: '开源开发者，专注于前端，以及前端相关工具库和工具链开发',
    links: [
      { type: 'github', icon: 'github', link: 'https://github.com/LittleSound' },
      { type: 'twitter', icon: 'twitter', link: 'https://twitter.com/OikawaRizumu' },
    ],
    nameAliases: ['LittleSound', '绚香音', '絢香音', 'Rizumu Oikawa', 'Rizumu Ayaka', 'Ayaka Rizumu', 'Rizumu'],
    emailAliases: ['rizumu@ayaka.moe', 'rizumu@oqo.moe'],
>>>>>>> 1276f4089ed8d373ece5e450097ec954a9a5967b
  },
].map<Creator>((c) => {
  c.avatar = c.avatar || getAvatarUrl(c.username)
  return c as Creator
})

export const creatorNames = creators.map(c => c.name)
export const creatorUsernames = creators.map(c => c.username || '')
