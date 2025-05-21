cronAdd("delete_old_rooms", "0 0 * * *", () => {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    $app.db()
        .newQuery("DELETE FROM rooms WHERE updated < {:oneDayAgo}")
        .bind({"oneDayAgo": oneDayAgo})
        .execute()
})