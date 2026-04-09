const assert = require("node:assert/strict");

const API_BASE = process.env.API_BASE || "http://127.0.0.1:3000";

async function request(path, options = {}) {
  let response;

  try {
    response = await fetch(`${API_BASE}${path}`, {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
  } catch (error) {
    throw new Error(
      `${options.method || "GET"} ${path} -> Could not reach ${API_BASE}. Start the backend first or set API_BASE to a live server.`
    );
  }

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = payload?.message || `Request failed: ${response.status}`;
    throw new Error(`${options.method || "GET"} ${path} -> ${message}`);
  }

  return payload;
}

async function main() {
  const health = await request("/health");
  assert.equal(health.status, "ok", "Backend health check failed");

  const suffix = `${Date.now()}`;
  const userA = {
    username: `frienda${suffix}`,
    email: `frienda${suffix}@example.com`,
    password: "password123",
  };
  const userB = {
    username: `friendb${suffix}`,
    email: `friendb${suffix}@example.com`,
    password: "password123",
  };

  const registeredA = await request("/users/register", { method: "POST", body: userA });
  const registeredB = await request("/users/register", { method: "POST", body: userB });

  const tokenA = registeredA.token;
  const tokenB = registeredB.token;

  assert.ok(tokenA, "User A did not receive a token");
  assert.ok(tokenB, "User B did not receive a token");

  const addFriend = await request("/users/friends", {
    method: "POST",
    token: tokenA,
    body: { username: userB.username },
  });

  assert.equal(addFriend.friend.username, userB.username, "Friend add returned the wrong user");

  const friendsA = await request("/users/friends", { token: tokenA });
  const friendsB = await request("/users/friends", { token: tokenB });

  assert.ok(
    friendsA.friends.some((friend) => friend.username === userB.username),
    "User A does not see user B in friends"
  );
  assert.ok(
    friendsB.friends.some((friend) => friend.username === userA.username),
    "User B does not see user A in friends"
  );

  const recipientCalendar = await request("/calendars", {
    method: "POST",
    token: tokenB,
    body: {
      title: "Recipient Filing",
      color: "#6AD4A7",
      category: "personal",
      description: "Used by the smoke test for direct-share filing",
    },
  });

  const ownerCalendar = await request("/calendars", {
    method: "POST",
    token: tokenA,
    body: {
      title: "Shared Study",
      color: "#90A7FF",
      category: "school",
      description: "Smoke-test calendar",
    },
  });

  await request(`/calendars/${ownerCalendar.calendar.id}/share`, {
    method: "POST",
    token: tokenA,
    body: {
      username: userB.username,
      permission: "edit",
    },
  });

  const calendarsB = await request("/calendars", { token: tokenB });
  const visibleSharedCalendar = calendarsB.calendars.find(
    (calendar) => calendar.id === ownerCalendar.calendar.id
  );

  assert.ok(visibleSharedCalendar, "Shared calendar is not visible to the friend");
  assert.equal(
    visibleSharedCalendar.access_permission,
    "edit",
    "Shared calendar permission did not persist"
  );

  const item = await request("/items", {
    method: "POST",
    token: tokenA,
    body: {
      title: "Group review session",
      type: "event",
      calendarId: ownerCalendar.calendar.id,
      startAt: "2026-04-11T16:00:00.000Z",
      endAt: "2026-04-11T17:00:00.000Z",
      reminders: [60],
    },
  });

  await request(`/items/${item.item.id}/share`, {
    method: "POST",
    token: tokenA,
    body: {
      username: userB.username,
      permission: "edit",
    },
  });

  const itemsB = await request("/items?view=all", { token: tokenB });
  const visibleSharedItem = itemsB.items.find((entry) => entry.id === item.item.id);

  assert.ok(visibleSharedItem, "Directly shared item is not visible to the friend");
  assert.equal(visibleSharedItem.is_direct_share, true, "Item should be marked as a direct share");

  const updatedPlacement = await request(`/items/${item.item.id}/my-calendar`, {
    method: "PATCH",
    token: tokenB,
    body: {
      calendarId: recipientCalendar.calendar.id,
    },
  });

  assert.equal(
    updatedPlacement.item.share_calendar_id,
    recipientCalendar.calendar.id,
    "Recipient-specific calendar placement did not persist"
  );

  const dashboardB = await request("/items/dashboard", { token: tokenB });
  assert.ok(
    dashboardB.summary.sharedCount >= 1,
    "Friend dashboard does not show the shared item count"
  );

  console.log("Friend system smoke test passed.");
  console.log(
    JSON.stringify(
      {
        users: [userA.username, userB.username],
        friendCountForA: friendsA.friends.length,
        friendCountForB: friendsB.friends.length,
        sharedCalendarId: ownerCalendar.calendar.id,
        sharedItemId: item.item.id,
        recipientCalendarId: recipientCalendar.calendar.id,
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
