import React, { type FunctionComponent, useContext } from 'react';
import { Pressable, TextInput, View, Text, SafeAreaView } from 'react-native';
import { SupabaseUserSession } from '../contexts/user_session';
import { Formik } from 'formik';
import * as yup from 'yup';
import { signUpWithEmail } from '../lib/supabase';
import { type NativeStackScreenProps } from '@react-navigation/native-stack';
import { useNavigation } from 'expo-router';
import { SupabaseUser } from '../contexts/supabase_user';

interface OwnProps extends NativeStackScreenProps<any> {}

type Props = OwnProps;

const Signup: FunctionComponent<Props> = (_: OwnProps) => {
  const { setSession } = useContext(SupabaseUserSession);
  const { setUser } = useContext(SupabaseUser);

  const navigation = useNavigation();
  const validationSchema = yup.object({
    email: yup.string().email('Enter a valid email').required('Email is required'),
    password: yup.string().required('Password is required'),
    password2: yup
      .string()
      .required('Password (Again) is required')
      .oneOf([yup.ref('password')], "Passwords don't match"),
  });

  const submitForm = async (values: { email: string; password: string }, { setErrors }: any) => {
    const data = await signUpWithEmail(values.email, values.password);

    if (data?.error != null) {
      setSession(null);
      setErrors({ password: data.error.message });
      return;
    }

    if (data?.data === null) {
      console.log('No data found?');
      return;
    }

    setSession(data.data.session);
    setUser(data.data.user);

    if (navigation !== null) {
      // @ts-expect-error It complains about never but it is there
      navigation.navigate('userInformation');
    }
  };

  return (
    <SafeAreaView className={'h-full w-full bg-white px-5 pt-12'}>
      <Formik
        initialValues={{ email: '', password: '', password2: '' }}
        onSubmit={submitForm}
        validationSchema={validationSchema}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View className={'flex'}>
            <Text className={'font-primary_medium text-2xl'}>Create a new account</Text>
            <Text className={'mt-5 font-primary text-lg text-primary-text'}>Email</Text>
            <TextInput
              className={
                'w-full rounded-lg border-2 border-primary bg-white px-3 py-2 font-primary text-base text-primary-text'
              }
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              autoCapitalize='none'
              placeholder={'alexander@pom.show'}
              placeholderTextColor="gray"
              autoComplete={'email'}
              keyboardType={'email-address'}
            />
            <View className={'flex shrink'}>
              <Text className={'text-lg text-red-600'}>
                {errors.email != null && touched.email === true && errors.email}
              </Text>
            </View>

            <Text className={'font-primary text-lg text-primary-text'}>Password</Text>
            <TextInput
              className={
                'w-full rounded-lg border-2 border-primary bg-white px-3 py-2 font-primary text-base text-black'
              }
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
              autoCapitalize='none'
              secureTextEntry={true}
              placeholder={'Al3xand3r!'}
              textContentType={'password'}
              passwordRules={
                'minlength: 8; required: lower; required: upper; required: digit; required: [-];'
              }
              placeholderTextColor="gray"
            />
            <View className={'flex shrink'}>
              <Text className={'text-lg text-red-600'}>
                {errors.password != null && touched.password === true && errors.password}
              </Text>
            </View>
            <Text className={'font-primary text-lg text-primary-text'}>Password (Again)</Text>
            <TextInput
              className={
                'w-full rounded-lg border-2 border-primary bg-white px-3 py-2 font-primary text-base text-black'
              }
              onChangeText={handleChange('password2')}
              onBlur={handleBlur('password2')}
              value={values.password2}
              autoCapitalize='none'
              secureTextEntry={true}
              placeholder={'Al3xand3r!'}
              textContentType={'password'}
              placeholderTextColor="gray"
            />
            <View className={'flex shrink'}>
              <Text className={'text-lg text-red-600'}>
                {errors.password2 != null && touched.password2 === true && errors.password2}
              </Text>
            </View>

            <Pressable
              onPress={() => {
                handleSubmit();
              }}
              className={'flex h-16 w-32 justify-center rounded-md bg-accent'}
            >
              <Text className={'self-center text-white'}>Next</Text>
            </Pressable>
          </View>
        )}
      </Formik>
    </SafeAreaView>
  );
};

export default Signup;
