import { differenceInSeconds } from 'date-fns'
import { useContext, useEffect } from 'react'
import { CyclesContext } from '../../../../contexts/CyclesContext'
import { CountdownContainer, Separator } from './styles'

export function Countdown() {
  const {
    activeCycle,
    activeCycleId,
    markCurrentCycleAsFinished,
    setSecondsPassed,
    amountSecondsPassed,
  } = useContext(CyclesContext)

  const totalMinutesInSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0

  // Inicia o countdown se existir um ciclo activo
  useEffect(() => {
    let interval: number

    if (activeCycle) {
      interval = setInterval(() => {
        const secondsDifference = differenceInSeconds(
          new Date(),
          activeCycle.startDate,
        )

        if (secondsDifference >= totalMinutesInSeconds) {
          markCurrentCycleAsFinished()
          setSecondsPassed(totalMinutesInSeconds)
          clearInterval(interval)
        } else {
          setSecondsPassed(secondsDifference)
        }
      }, 1000)
    }

    return () => {
      clearInterval(interval)
    }
  }, [
    activeCycle,
    activeCycleId,
    markCurrentCycleAsFinished,
    totalMinutesInSeconds,
    setSecondsPassed,
  ])

  const currentSecond = activeCycle
    ? totalMinutesInSeconds - amountSecondsPassed
    : 0

  const minutesAmount = Math.floor(currentSecond / 60)
  const secondsAmount = currentSecond % 60

  const minutes = String(minutesAmount).padStart(2, '0')
  const seconds = String(secondsAmount).padStart(2, '0')

  // This useEffect mostra o countdown do titulo da pagina
  useEffect(() => {
    if (activeCycle) {
      document.title = `${minutes}:${seconds}`
    }
  }, [minutes, seconds, activeCycle])

  return (
    <CountdownContainer>
      <span>{minutes[0]}</span>
      <span>{minutes[1]}</span>
      <Separator>:</Separator>
      <span>{seconds[0]}</span>
      <span>{seconds[1]}</span>
    </CountdownContainer>
  )
}
