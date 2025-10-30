import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { supabase } from '../../lib/supabase'
const HomeScreen =  () => {
useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError) {
        console.error('Error fetching user:', userError)
        return
      }

      if (!user) {
        console.log('No user logged in')
        return
      }

      console.log('User ID:', user.id)

      // Fetch from your profiles table
      const { data: profile, error: profileError } = await supabase
        .from('userinfo')
        .select('*')
        .eq('id', user.id)
        .maybeSingle() 

      if (profileError) {
        console.error('Error fetching profile:', profileError)
      } else {
        console.log('Profile:', profile)
      }
    }

    fetchProfile()
  }, [])
  return (
    <View style={{flex:1,backgroundColor:"pink"}}>
      <Text>HomeScreen</Text>
    </View>
  )
}

export default HomeScreen