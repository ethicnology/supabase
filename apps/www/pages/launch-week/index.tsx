import { NextSeo } from 'next-seo'

import _days from '~/components/LaunchWeek/days.json'
import { WeekDayProps } from '~/components/LaunchWeek/types'
import DefaultLayout from '~/components/Layouts/Default'
import SectionContainer from '~/components/Layouts/SectionContainer'

import { createClient, Session } from '@supabase/supabase-js'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import TicketContainer from '~/components/LaunchWeek/Ticket/TicketContainer'
import { useTheme } from '~/components/Providers'
import classNames from 'classnames'
import styleUtils from '~/components/LaunchWeek/Ticket/utils.module.css'
import { SITE_ORIGIN } from '~/lib/constants'
import { Accordion, Badge } from 'ui'

const days = _days as WeekDayProps[]

export default function launchweek() {
  const { isDarkMode } = useTheme()

  const title = 'Launch Week 6'
  const description = 'Supabase Launch Week 6 | 12-18 Dec 2022'

  const [supabase] = useState(() =>
    createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  )

  const [days, setDays] = useState([])

  const [session, setSession] = useState<Session | null>(null)
  const { query } = useRouter()
  const ticketNumber = query.ticketNumber?.toString()
  const defaultUserData = {
    id: query.id?.toString(),
    ticketNumber: ticketNumber ? parseInt(ticketNumber, 10) : undefined,
    name: query.name?.toString(),
    username: query.username?.toString(),
  }

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      setSession(session)
    })
    getDays()
  }, [])

  async function getDays() {
    try {
      // setLoading(true)
      console.log('get data')
      let supa = await supabase.from('lw6_days').select().order('release_date')
      // .gt('release_date', `to_timestamptz(${Date.now()})`) Filter days by release date...

      let { data, error, status } = supa

      if (error && status !== 406) {
        throw error
      }

      if (data) {
        console.log(supa)
        setDays(data)
      }
    } catch (error) {
      // alert('Error loading user data!')
      console.log(error)
    } finally {
      // setLoading(false)
    }
  }

  useEffect(() => {
    document.body.className = isDarkMode ? 'dark bg-[#121212]' : 'light bg-[#fff]'
  }, [isDarkMode])

  const AccordionHeader = ({ date }: any) => {
    //todo coming soon check

    console.log(date)
    const [weekday, month, day] = dayFormat(date.release_date)
    return (
      <div className="flex flex-1">
        <div className="flex gap-4 min-w-[320px]">
          <Badge>Coming Soon</Badge>
          <span className="text-scale-900 text-sm">
            {weekday} | {day} {month} 2022
          </span>
        </div>
        <span className="text-scale-1200">{date.title}</span>
      </div>
    )
  }

  const dayFormat = (timestamp: string) => {
    const day = new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    }).format(new Date(timestamp))
    return day.split(/[\s,]+/)
  }

  console.log(days)
  return (
    <>
      <NextSeo
        title={title}
        openGraph={{
          title: title,
          description: description,
          url: `https://supabase.com/launch-week`,
          images: [
            {
              url: `${SITE_ORIGIN}/images/launchweek/launch-week-6.jpg`,
            },
          ],
        }}
      />
      <DefaultLayout>
        <SectionContainer className="flex flex-col !pb-24 items-center lg:pt-32 gap-32">
          <div
            className={classNames(
              styleUtils.appear,
              styleUtils['appear-first'],
              'flex flex-col justify-center gap-3'
            )}
          >
            <div className="flex justify-center">
              <img
                src="/images/launchweek/launchweek-logo--light.svg"
                className="flex w-40 dark:hidden lg:w-80"
              />
              <img
                src="/images/launchweek/launchweek-logo--dark.svg"
                className="hidden w-40 dark:flex lg:w-80"
              />
            </div>
            <p className="text-scale-1100 text-sm text-center">Dec 12 – 16 at 8 AM PT | 11 AM ET</p>
          </div>
          {!process.env.NEXT_PUBLIC_LW_STARTED && (
            <div className={classNames(styleUtils.appear, styleUtils['appear-second'])}>
              <TicketContainer
                supabase={supabase}
                session={session}
                defaultUserData={defaultUserData}
                defaultPageState={query.ticketNumber ? 'ticket' : 'registration'}
              />
            </div>
          )}
        </SectionContainer>
        <div
          className={classNames(
            styleUtils.appear,
            styleUtils['appear-third'],
            'gradient-container'
          )}
        >
          <div
            className={classNames(styleUtils.appear, styleUtils['appear-fourth'], 'gradient-mask')}
          ></div>
          <div className="gradient-mask--masked bottom-of-the-circle"></div>

          <div
            className={classNames(
              // styleUtils.appear,
              // styleUtils['appear-second'],
              'flair-mask-a the-stroke-of-the-circle'
            )}
          ></div>
          <div
            className={classNames(
              // styleUtils.appear,
              // styleUtils['appear-second'],
              'flair-mask-b inside-the-circle'
            )}
          ></div>
          {process.env.NEXT_PUBLIC_LW_STARTED && (
            <SectionContainer className=" lg:py-72">
              <Accordion
                type="default"
                openBehaviour="multiple"
                size="large"
                className="text-scale-900 dark:text-white"
                justified={false}
                bordered={false}
                chevronAlign="right"
              >
                {days.length > 0 &&
                  days.map((day: any, index) => {
                    console.log(dayFormat(day.release_date))
                    return (
                      <div className="border-b pb-3" key={day.id}>
                        <Accordion.Item header={<AccordionHeader date={day} />} id={`day-${index}`}>
                          <div className="h-[400px] flex">
                            <div
                              className={`flex-1 border rounded-xl border-gray-900 h-full bg-no-repeat bg-[center_top_200px] bg-contain bg-${
                                day.steps.one ? `[url('${day.steps.one.bgUrl}')]` : 'red-900'
                              } `}
                            >
                              TEST ONE CUBE
                              <div>wat</div>
                              <div>keep trying</div>
                            </div>
                            <div className="flex-1 bg-green-900 border rounded-xl border-gray-900 h-full">
                              TEST TWO CUBES
                            </div>
                          </div>
                        </Accordion.Item>
                      </div>
                    )
                  })}
              </Accordion>
            </SectionContainer>
          )}
        </div>
      </DefaultLayout>
    </>
  )
}
