/**
 * Given   I am logged in
 *   And   Have a profile
 *   And   A post is not loved by me
 *         (and, thus) The post exists
 *  When   I click love on a post
 *  Then   // The thread is loved visually
 *   And   The thread loved count++
 *   And   The thread is added to my loved threads
 *
 * @param uid Firebase user UID, with a valid profile data in /database/profiles/{uid}
 * @param threadid The id of a Stream Thread, found in /database/stream/{threadid}
 */
export function loveThread (uid: string, threadid: string): void {
  console.log('threads/loveThread: not implemented yet, params: ', uid, threadid)
}
