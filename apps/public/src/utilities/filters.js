export const participantsForRace = (participants, race) => participants.filter((p) => p.race === race.id).length
export const getRaceById = (races, id) => races.filter((race) => id === race.id)[0]
