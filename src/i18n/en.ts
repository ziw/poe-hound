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
    name: 'Name',
    search: 'Search',
  }
}

export default en;