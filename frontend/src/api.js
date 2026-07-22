export async function fetchStory(entity = "ALL") {
  const res = await fetch(`/api/story?entity=${encodeURIComponent(entity)}`);
  if (!res.ok) {
    throw new Error(`Failed to load story: ${res.status}`);
  }
  return res.json();
}

export async function fetchViolationDetail(id) {
  const res = await fetch(`/api/violation/${id}`);
  if (!res.ok) {
    throw new Error(`Failed to load violation: ${res.status}`);
  }
  return res.json();
}

export async function fetchDeepDive(chapter) {
  const res = await fetch(`/api/deepdive/${chapter}`);
  if (!res.ok) {
    throw new Error(`Failed to load deep dive: ${res.status}`);
  }
  return res.json();
}
