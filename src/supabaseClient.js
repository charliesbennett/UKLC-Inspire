import { createClient } from '@supabase/supabase-js'

// Replace with your actual credentials
const supabaseUrl = 'https://szhbpfecthwwwghhtsaq.supabase.co'

const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6aGJwZmVjdGh3d3dnaGh0c2FxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMjg3NjEsImV4cCI6MjA4NTcwNDc2MX0.pKN483Ng4BGgYKizuGGWtpynQor-29RSw8uGOe8dQKs'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'Content-Type': 'application/json'
    }
  }
})
