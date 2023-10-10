import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://oeybruqyypqhrcxcgkbw.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9leWJydXF5eXBxaHJjeGNna2J3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTYzMjM3NDQsImV4cCI6MjAxMTg5OTc0NH0.WHyDOkZI_dPG8-yMZXT48WD4uf_-GJHGLpjldtHdIwU";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})