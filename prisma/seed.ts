import 'dotenv/config'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../src/generated/prisma/client'
import bcrypt from 'bcryptjs'

const pool = new Pool({
  host: 'aws-0-ap-southeast-1.pooler.supabase.com',
  port: 6543,
  user: 'postgres.nqovimcbdwiqntagrqex',
  password: process.env.DB_PASSWORD,
  database: 'postgres',
  ssl: { rejectUnauthorized: false },
})
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Seeding database...')

  // 기존 데이터 초기화
  await prisma.joinApplication.deleteMany()
  await prisma.clubMember.deleteMany()
  await prisma.post.deleteMany()
  await prisma.club.deleteMany()
  await prisma.user.deleteMany()

  // 사용자 생성
  const adminPw = await bcrypt.hash('Admin1234!', 12)
  const userPw = await bcrypt.hash('User1234!', 12)

  const admin = await prisma.user.create({
    data: {
      name: '관리자',
      email: 'admin@samchully.co.kr',
      password: adminPw,
      department: '경영지원팀',
      role: 'ADMIN',
    },
  })

  const users = await Promise.all([
    prisma.user.create({ data: { name: '김삼천', email: 'user1@samchully.co.kr', password: userPw, department: '영업팀' } }),
    prisma.user.create({ data: { name: '이리나', email: 'user2@samchully.co.kr', password: userPw, department: '기술팀' } }),
    prisma.user.create({ data: { name: '박민준', email: 'user3@samchully.co.kr', password: userPw, department: '마케팅팀' } }),
    prisma.user.create({ data: { name: '최수진', email: 'user4@samchully.co.kr', password: userPw, department: '인사팀' } }),
    prisma.user.create({ data: { name: '정우성', email: 'user5@samchully.co.kr', password: userPw, department: '재무팀' } }),
  ])

  // 동아리 생성
  const clubsData = [
    { name: '산악회', description: '매주 주말 등산으로 체력과 동료애를 쌓는 모임입니다. 초보자도 환영합니다! 전국 명산을 함께 오르며 자연의 아름다움을 만끽해요.', category: 'SPORTS' as const, maxMembers: 40 },
    { name: '독서클럽', description: '월 1회 책을 선정하고 독후감을 나누는 독서 동아리입니다. 다양한 장르의 책을 통해 새로운 시각을 넓혀보세요.', category: 'READING' as const, maxMembers: 20 },
    { name: '사진부', description: 'DSLR부터 스마트폰까지, 사진을 사랑하는 사람들의 모임입니다. 정기 출사와 피드백을 통해 실력을 키워나가요.', category: 'PHOTO' as const, maxMembers: 25 },
    { name: '밴드부', description: '기타, 드럼, 보컬이 모여 함께 연주하는 음악 동아리입니다. 매주 수요일 저녁 함께 모여 연습합니다.', category: 'MUSIC' as const, maxMembers: 15 },
    { name: '요리동아리', description: '다양한 나라의 요리를 직접 만들어보는 쿠킹 클래스입니다. 매달 테마를 정해 함께 요리하고 나눠 먹어요.', category: 'COOKING' as const, maxMembers: 20 },
    { name: '여행클럽', description: '국내외 여행 계획 및 여행 후기를 나누는 동아리입니다. 분기별 단체 여행도 진행합니다.', category: 'TRAVEL' as const, maxMembers: 30 },
    { name: '보드게임부', description: '다양한 전략 보드게임을 즐기는 주 1회 모임입니다. 초보자도 쉽게 배울 수 있도록 도와드립니다.', category: 'GAME' as const, maxMembers: 20 },
    { name: '미술동아리', description: '수채화, 유화, 드로잉 등 다양한 미술 활동을 하는 모임입니다. 그림에 관심 있다면 누구든 환영해요.', category: 'ART' as const, maxMembers: 15 },
  ]

  const clubs = await Promise.all(
    clubsData.map((club) => prisma.club.create({ data: club }))
  )

  // 멤버십 생성 (admin → 모든 동아리 리더, users → 일부 동아리 멤버)
  await Promise.all(
    clubs.map((club) =>
      prisma.clubMember.create({
        data: { userId: admin.id, clubId: club.id, memberRole: 'LEADER' },
      })
    )
  )

  // users[0]은 산악회, 독서클럽 가입
  await prisma.clubMember.createMany({
    data: [
      { userId: users[0].id, clubId: clubs[0].id },
      { userId: users[0].id, clubId: clubs[1].id },
      { userId: users[1].id, clubId: clubs[0].id },
      { userId: users[1].id, clubId: clubs[2].id },
      { userId: users[2].id, clubId: clubs[3].id },
      { userId: users[2].id, clubId: clubs[4].id },
      { userId: users[3].id, clubId: clubs[5].id },
      { userId: users[4].id, clubId: clubs[6].id },
      { userId: users[4].id, clubId: clubs[7].id },
    ],
  })

  // 공지 게시글
  await prisma.post.createMany({
    data: [
      {
        title: '2024년 삼천리 동아리 커뮤니티 오픈 안내',
        content: `안녕하세요, 삼천리 구성원 여러분!

사내 동아리 커뮤니티 플랫폼이 새롭게 오픈되었습니다. 🎉

이 플랫폼을 통해 다양한 동아리 활동 정보를 확인하고, 원하는 동아리에 가입할 수 있습니다.

주요 기능:
• 동아리 검색 및 가입 신청
• 동아리별 게시판
• 활동 공지 및 안내

많은 참여 바랍니다. 감사합니다.`,
        authorId: admin.id,
        clubId: null,
        isPinned: true,
      },
      {
        title: '동아리 가입 신청 방법 안내',
        content: `동아리 가입 신청 방법을 안내해 드립니다.

1. 회원가입 후 로그인
2. 원하는 동아리 상세 페이지 방문
3. "가입 신청하기" 버튼 클릭
4. 가입 동기 작성 후 신청

동아리 리더 승인 후 정식 멤버가 됩니다.
문의사항은 경영지원팀으로 연락해주세요.`,
        authorId: admin.id,
        clubId: null,
        isPinned: false,
      },
    ],
  })

  // 동아리별 게시글
  for (const club of clubs.slice(0, 3)) {
    await prisma.post.create({
      data: {
        title: `${club.name} 이번 달 활동 안내`,
        content: `${club.name} 구성원 여러분, 안녕하세요!\n\n이번 달 활동 일정을 안내해 드립니다.\n\n참여 희망하시는 분들은 게시판에 댓글 남겨주세요. 많은 참여 부탁드립니다!`,
        authorId: admin.id,
        clubId: club.id,
        isPinned: true,
      },
    })
  }

  console.log('✅ Seed complete!')
  console.log(`   - ${clubs.length}개 동아리`)
  console.log(`   - ${users.length + 1}명 사용자`)
  console.log(`   - admin: admin@samchully.co.kr / Admin1234!`)
  console.log(`   - user:  user1@samchully.co.kr / User1234!`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
