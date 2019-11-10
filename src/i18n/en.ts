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
    shaped: 'Shaped',
    elder: 'Elder',
    search: 'Search',
    clear: 'Clear',
    quality: 'Quality',
    level: 'Gem Level',
    corrupted: 'Corrupted',
    min: 'min',
    max: 'max',
  },

  mods: {
    corrupted: 'Corrupted',
    unided: 'Unidentified',
  }
}

export default en;