export default defineTask({
  async run() {
    const now = new Date()

    const expiredItems = await db.profileItem.findMany({
      where: { scheduleAction: "DELETE", scheduledEnd: { lte: now } },
      select: { id: true, userId: true, user: { select: { slug: true } } },
    })
    if (expiredItems.length === 0) {
      return { deletedCount: 0 }
    }

    await db.profileItem.deleteMany({ where: { id: { in: expiredItems.map(item => item.id) } } })

    const userIds = [...new Set(expiredItems.map(item => item.userId))]
    const slugs = [...new Set(expiredItems.map(item => item.user.slug))]

    await Promise.all([
      ...userIds.map(userId => deleteCached(CacheKeys.userItems(userId))),
      ...userIds.map(userId => deleteCached(CacheKeys.analytics(userId))),
      ...slugs.map(slug => deleteCached(CacheKeys.userProfile(slug))),
    ])

    return { result: `Deleted ${expiredItems.length} expired scheduled item(s)` }
  },
})
