const en = {
  login: {
    login_button_label: 'LOGIN',
    login_error_message: 'Your session ID seems to be incorrect. Let’s try that again.',
  },
  jobs: {
    //job message
    authenticate_message: `Authenticating session ID`,
    wait_message: (time: number) => `waiting for ${time} seconds`,
    load_all_characters_message: `Loading characters list`,
    load_stash_metadata_message: (leagueName: string) => `Loading stash tabs in ${leagueName}`,

    //status
    in_progress: 'In progress',
    success: 'Success',
    failed: 'Failed',
  },

  filters: {
    itemName: 'Name',
    itemTypeLine: 'Base',
    shaped: 'Shaper',
    elder: 'Elder',
    hunter: 'Hunter',
    redeemer: 'Redeemer',
    warlord: 'Warlord',
    crusader: 'Crusader',
    search: 'Search',
    clear: 'Clear',
    quality: 'Quality',
    level: 'Gem Level',
    corrupted: 'Corrupted',
    min: 'min',
    max: 'max',
    numSockets: 'Sockets',
    numLinks: 'Links',
    abyssalSocket: 'Abyssal Socket',
    whiteSocket: 'White Socket',
    explicitMods: 'Explicit',
    craftedMods: 'Crafted',
    implicitMods: 'Implicit',
    enchantedMods: 'Enchanted',
    armor: 'Armor',
    evasion: 'Evasion',
    energyShield: 'Energy Shield',

    sections: {
      itemNameType: 'Name and Type',
      mods: 'Item Mods',
      sockets: 'Links and Sockets',
      influence: 'Influence',
      properties: 'Properties',
    }
  },

  mods: {
    corrupted: 'Corrupted',
    unided: 'Unidentified',
    quality: 'Quality',
    level: 'Level',
  }
}

export default en;