export interface RSQLBuildOptions {
  /**
   * Determines if the whole string should be encoded or not.  
   * If you are passing the params in an Angular HttpClient BODY, then set this value to false when calling build()
   */
  encodeString?: boolean;
}
