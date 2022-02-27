import { shallowMount } from '@vue/test-utils'
import Login from '@/components/Login.vue'

describe('Login.vue', () => {
  it('renders props.title when passed', () => {
    const title = 'new message'
    const wrapper = shallowMount(Login, {
      propsData: { title }
    })
    expect(wrapper.text()).toMatch(title)
  })
})
