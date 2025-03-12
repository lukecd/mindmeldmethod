'use client'

import { useState, useEffect, useRef } from 'react'
import Script from 'next/script'

// BBC Video transcript data with corrected Spanish
const sampleTranscript: TranscriptSegment[] = [
  {
    startTime: 0,
    endTime: 5,
    spanish: "Existen miles de criptomonedas en el mundo. Entre ellas está Ethereum, Cardano",
    english: "There are thousands of cryptocurrencies in the world. Among them are Ethereum, Cardano"
  },
  {
    startTime: 5,
    endTime: 11,
    spanish: "o el controvertido Dogecoin. Pero la más grande de todas es Bitcoin. Sus defensores",
    english: "or the controversial Dogecoin. But the biggest of them all is Bitcoin. Its supporters"
  },
  {
    startTime: 11,
    endTime: 16,
    spanish: "aseguran que es el 'oro digital' que va a poner fin a la supremacía del dólar y",
    english: "claim that it's the 'digital gold' that will end the dollar's supremacy and"
  },
  {
    startTime: 16,
    endTime: 21,
    spanish: "que va a cambiar todo el sistema financiero mundial. En cambio, sus críticos hablan de",
    english: "will change the entire global financial system. However, its critics speak of"
  },
  {
    startTime: 21,
    endTime: 26,
    spanish: "una burbuja que va a estallar en cualquier momento porque no tiene ningún respaldo y",
    english: "a bubble that will burst at any moment because it has no backing and"
  },
  {
    startTime: 26,
    endTime: 32,
    spanish: "se ha convertido en una guarida de especuladores y criminales. Es como esas cosas que odias",
    english: "has become a haven for speculators and criminals. It's like those things you either hate"
  },
  {
    startTime: 32,
    endTime: 37,
    spanish: "o amas. Y como hay miles y miles de millones de dólares en juego, la batalla es a muerte.",
    english: "or love. And with billions and billions of dollars at stake, it's a fight to the death."
  },
  {
    startTime: 37,
    endTime: 43,
    spanish: "En este video te voy a explicar lo más esencial sobre Bitcoin respondiendo a estas cuatro",
    english: "In this video, I'll explain the essentials about Bitcoin by answering these four"
  },
  {
    startTime: 43,
    endTime: 51,
    spanish: "preguntas: qué es, cómo funciona, cuáles son sus ventajas y cuáles son sus riesgos.",
    english: "questions: what it is, how it works, what are its advantages, and what are its risks."
  },
  {
    startTime: 51,
    endTime: 57,
    spanish: "Bitcoin es un tipo de criptomoneda, es decir, una divisa digital que se utiliza como",
    english: "Bitcoin is a type of cryptocurrency, that is, a digital currency that is used as"
  },
  {
    startTime: 57,
    endTime: 62,
    spanish: "medio de intercambio para comprar y vender productos o como una inversión. No existe",
    english: "a medium of exchange to buy and sell products or as an investment. It doesn't exist"
  },
  {
    startTime: 62,
    endTime: 67,
    spanish: "físicamente, no lo emite ningún banco central, no lo controla ningún país, como tampoco",
    english: "physically, it's not issued by any central bank, it's not controlled by any country, nor"
  },
  {
    startTime: 67,
    endTime: 74,
    spanish: "ninguna empresa. Por eso se dice que es una moneda independiente y descentralizada. Fue",
    english: "by any company. That's why it's called an independent and decentralized currency. It was"
  },
  {
    startTime: 74,
    endTime: 78,
    spanish: "creado en 2009 por un programador anónimo -o por un grupo de programadores- bajo el",
    english: "created in 2009 by an anonymous programmer -or by a group of programmers- under the"
  },
  {
    startTime: 78,
    endTime: 84,
    spanish: "seudónimo de Satoshi Nakamoto, quien se ha convertido en una leyenda entre los defensores",
    english: "pseudonym of Satoshi Nakamoto, who has become a legend among supporters"
  },
  {
    startTime: 84,
    endTime: 89,
    spanish: "de las criptomonedas. En aquel momento el sistema fue programado para generar una cantidad",
    english: "of cryptocurrencies. At that time, the system was programmed to generate a limited"
  },
  {
    startTime: 89,
    endTime: 96,
    spanish: "limitada de 21 millones de Bitcoin y se calcula que el último de ellos será minado el año",
    english: "amount of 21 million Bitcoin and it's estimated that the last one will be mined in the year"
  },
  {
    startTime: 96,
    endTime: 102,
    spanish: "2140. La idea detrás de la creación de Bitcoin -en medio de la crisis financiera",
    english: "2140. The idea behind Bitcoin's creation -amid the financial crisis"
  },
  {
    startTime: 102,
    endTime: 108,
    spanish: "de 2008- era buscar una alternativa a un mercado financiero dependiente de los bancos. Como",
    english: "of 2008- was to seek an alternative to a bank-dependent financial market. Since"
  },
  {
    startTime: 108,
    endTime: 113,
    spanish: "en la actualidad 1 Bitcoin vale decenas de miles de dólares, muchas personas compran",
    english: "currently 1 Bitcoin is worth tens of thousands of dollars, many people buy"
  },
  {
    startTime: 113,
    endTime: 118,
    spanish: "pedacitos de Bitcoin, conocidos como satoshis o sats. Y lo hacen a través de los llamados",
    english: "pieces of Bitcoin, known as satoshis or sats. And they do it through so-called"
  },
  {
    startTime: 118,
    endTime: 123,
    spanish: "'exchanges' o plataformas digitales de intercambio, a las cuales acceden desde una",
    english: "'exchanges' or digital trading platforms, which they access from a"
  },
  {
    startTime: 123,
    endTime: 128,
    spanish: "simple aplicación en el celular. Es así como una persona en México puede enviar dinero",
    english: "simple application on their phone. This is how someone in Mexico can send money"
  },
  {
    startTime: 128,
    endTime: 132,
    spanish: "a otra en Japón -de un celular a otro- en cuestión de segundos y sin tener que utilizar",
    english: "to someone in Japan -from one phone to another- in seconds without having to use"
  },
  {
    startTime: 132,
    endTime: 141,
    spanish: "un banco. Es decir, se elimina el intermediario. Bitcoin funciona a través de la cadena",
    english: "a bank. In other words, the intermediary is eliminated. Bitcoin works through the"
  },
  {
    startTime: 141,
    endTime: 147,
    spanish: "de bloques o blockchain. En términos muy sencillos, viene a ser una base de datos en",
    english: "blockchain. In very simple terms, it's a database where"
  },
  {
    startTime: 147,
    endTime: 153,
    spanish: "la que se registran y quedan aseguradas todas las transacciones. La blockchain opera a través",
    english: "all transactions are recorded and secured. The blockchain operates through"
  },
  {
    startTime: 153,
    endTime: 160,
    spanish: "de una red descentralizada de poderosas computadoras con nodos repartidos por el mundo. Estos nodos",
    english: "a decentralized network of powerful computers with nodes distributed around the world. These nodes"
  },
  {
    startTime: 160,
    endTime: 168,
    spanish: "están enlazados y asegurados usando criptografía. Pero, ¿cómo se crea un Bitcoin? Las computadoras",
    english: "are linked and secured using cryptography. But how is a Bitcoin created? The computers"
  },
  {
    startTime: 168,
    endTime: 173,
    spanish: "que están conectadas a la red trabajan día y noche para encontrar una respuesta válida",
    english: "connected to the network work day and night to find a valid answer"
  },
  {
    startTime: 173,
    endTime: 178,
    spanish: "a un complejo problema matemático. Cuando resuelven el acertijo, reciben como recompensa",
    english: "to a complex mathematical problem. When they solve the puzzle, they receive as a reward"
  },
  {
    startTime: 178,
    endTime: 184,
    spanish: "Bitcoin. A ese proceso se le llama minería y los que se dedican a esa actividad reciben",
    english: "Bitcoin. This process is called mining and those who engage in this activity are called"
  },
  {
    startTime: 184,
    endTime: 190,
    spanish: "el nombre de mineros. Por eso es probable que hayas escuchado la expresión 'minar",
    english: "miners. That's why you've probably heard the expression 'mining"
  },
  {
    startTime: 190,
    endTime: 196,
    spanish: "Bitcoin' en vez de crear Bitcoin. Recientemente este proceso ha sido criticado por su impacto",
    english: "Bitcoin' instead of creating Bitcoin. Recently this process has been criticized for its impact"
  },
  {
    startTime: 196,
    endTime: 201,
    spanish: "en el medioambiente, ya que las computadoras que se utilizan en la generación de los Bitcoin",
    english: "on the environment, as the computers used in the generation of Bitcoin"
  },
  {
    startTime: 201,
    endTime: 207,
    spanish: "consumen mucha energía eléctrica. Como todas las criptomonedas, Bitcoin sirve para hacer",
    english: "consume a lot of electrical energy. Like all cryptocurrencies, Bitcoin is used to make"
  },
  {
    startTime: 207,
    endTime: 212,
    spanish: "pagos rápidos y sin intermediario. En ese sentido les resulta útil a quienes envían",
    english: "quick payments without intermediaries. In this sense, it's useful for those who send"
  },
  {
    startTime: 212,
    endTime: 217,
    spanish: "dinero de un país a otro. Otra ventaja es que -hasta ahora- ha demostrado ser un buen",
    english: "money from one country to another. Another advantage is that -until now- it has proven to be a good"
  },
  {
    startTime: 217,
    endTime: 222,
    spanish: "negocio para los que invierten a largo plazo. Y, al mismo tiempo, está ganando una rápida",
    english: "business for long-term investors. And, at the same time, it's gaining rapid"
  },
  {
    startTime: 222,
    endTime: 226,
    spanish: "aceptación entre las empresas que administran fondos millonarios como, por ejemplo, los",
    english: "acceptance among companies that manage billion-dollar funds, such as"
  },
  {
    startTime: 226,
    endTime: 231,
    spanish: "grandes bancos de inversión. Desde otro punto de vista, algunos defensores de Bitcoin creen",
    english: "large investment banks. From another point of view, some Bitcoin supporters believe"
  },
  {
    startTime: 231,
    endTime: 237,
    spanish: "que esta moneda permitirá una mayor justicia social en los países más pobres, especialmente",
    english: "that this currency will allow greater social justice in poorer countries, especially"
  },
  {
    startTime: 237,
    endTime: 243,
    spanish: "en aquellos donde la moneda local está devaluada y el dinero es controlado por gobiernos corruptos.",
    english: "in those where the local currency is devalued and money is controlled by corrupt governments."
  },
  {
    startTime: 243,
    endTime: 252,
    spanish: "En el corto plazo, el precio de Bitcoin sube y baja como una montaña rusa. Es tan volátil",
    english: "In the short term, Bitcoin's price goes up and down like a roller coaster. It's so volatile"
  },
  {
    startTime: 252,
    endTime: 257,
    spanish: "que las autoridades de Estados Unidos y varios países europeos han advertido que la gente",
    english: "that authorities in the United States and several European countries have warned that people"
  },
  {
    startTime: 257,
    endTime: 263,
    spanish: "podría quedar en la ruina. Otra cosa a tener en cuenta es que las operaciones no son reversibles.",
    english: "could be ruined. Another thing to keep in mind is that operations are not reversible."
  },
  {
    startTime: 263,
    endTime: 268,
    spanish: "Es decir, así como nadie controla lo que tú haces, tampoco nadie te va a defender.",
    english: "That is, just as no one controls what you do, no one will defend you either."
  },
  {
    startTime: 268,
    endTime: 273,
    spanish: "Y si la empresa que almacena tus Bitcoin pone fin a sus operaciones o, por ejemplo, sufre",
    english: "And if the company storing your Bitcoin ends its operations or, for example, suffers"
  },
  {
    startTime: 273,
    endTime: 279,
    spanish: "un ataque informático, no puedes descartar que tu inversión desaparezca como el humo.",
    english: "a cyber attack, you can't rule out that your investment might vanish like smoke."
  },
  {
    startTime: 279,
    endTime: 284,
    spanish: "Básicamente, no hay garantías. Por eso, dicen los expertos, quien invierte en Bitcoin",
    english: "Basically, there are no guarantees. That's why, experts say, whoever invests in Bitcoin"
  },
  {
    startTime: 284,
    endTime: 290,
    spanish: "tiene que estar dispuesto a perder su dinero en caso de que las cosas salgan mal.",
    english: "must be willing to lose their money if things go wrong."
  }
]

interface TranscriptSegment {
  startTime: number;
  endTime: number;
  spanish: string;
  english: string;
}

interface YouTubePlayer {
  getCurrentTime: () => number;
  getDuration: () => number;
  pauseVideo: () => void;
  playVideo: () => void;
  seekTo: (seconds: number) => void;
  setPlaybackRate: (rate: number) => void;
}

interface YouTubeEvent {
  data: number;
}

declare global {
  interface Window {
    YT: {
      Player: new (
        element: HTMLElement | null,
        config: {
          videoId: string;
          playerVars?: {
            controls?: number;
            disablekb?: number;
            fs?: number;
            rel?: number;
            modestbranding?: number;
          };
          events?: {
            onStateChange?: (event: YouTubeEvent) => void;
            onReady?: () => void;
          };
        }
      ) => YouTubePlayer;
      PlayerState: {
        PLAYING: number;
      };
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

export default function BBCBitcoinBasicsPage() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [showEnglish, setShowEnglish] = useState(true)
  const [showSpanish, setShowSpanish] = useState(true)
  const [currentTime, setCurrentTime] = useState(0)
  
  const playerRef = useRef<YouTubePlayer | null>(null)
  const playerContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Initialize YouTube Player
    const tag = document.createElement('script')
    tag.src = "https://www.youtube.com/iframe_api"
    document.body.appendChild(tag)

    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player(playerContainerRef.current, {
        videoId: 'C-3aYnhF6Io', // BBC Video ID
        playerVars: {
          controls: 0,
          disablekb: 1,
          fs: 0,
          rel: 0,
          modestbranding: 1
        },
        events: {
          onStateChange: (event: YouTubeEvent) => {
            setIsPlaying(event.data === window.YT.PlayerState.PLAYING)
          },
          onReady: () => {
            // Player is ready
            setInterval(() => {
              if (playerRef.current) {
                setCurrentTime(playerRef.current.getCurrentTime())
              }
            }, 100)
          }
        }
      })
    }
  }, [])

  const togglePlayPause = () => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pauseVideo()
      } else {
        playerRef.current.playVideo()
      }
    }
  }

  const handleSpeedChange = (speed: number) => {
    if (playerRef.current) {
      playerRef.current.setPlaybackRate(speed)
      setPlaybackSpeed(speed)
    }
  }

  const playSegment = (startTime: number, endTime: number) => {
    if (playerRef.current) {
      if (isPlaying && currentTime >= startTime && currentTime <= endTime) {
        // If currently playing this segment, pause it
        playerRef.current.pauseVideo()
      } else {
        // Start playing this segment
        playerRef.current.seekTo(startTime)
        playerRef.current.playVideo()
        
        // Set up a check to pause at segment end
        const checkEnd = setInterval(() => {
          if (playerRef.current && playerRef.current.getCurrentTime() >= endTime) {
            playerRef.current.pauseVideo()
            clearInterval(checkEnd)
          }
        }, 100)
      }
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-[color:var(--color-bg-main)]">
      <Script src="https://www.youtube.com/iframe_api" />
      <div className="max-w-7xl mx-auto">
        {/* Player Section */}
        <div className="bg-[color:var(--color-bg-card)] px-10 py-10 mt-10">
          {/* YouTube Player */}
          <div className="aspect-video w-full">
            <div ref={playerContainerRef} className="w-full h-full" />
          </div>

          {/* Controls Bar */}
          <div className="border-t border-[color:var(--color-text-on-dark)]/10 py-2 px-4">
            <div className="flex items-center justify-center gap-4">
              <button
                className="bg-[color:var(--color-accent-secondary)] p-2 text-[color:var(--color-text-inverse)] font-title"
                onClick={togglePlayPause}
              >
                {isPlaying ? '⏸️' : '▶️'}
              </button>

              {/* Speed Control */}
              <select 
                value={playbackSpeed}
                onChange={(e) => handleSpeedChange(Number(e.target.value))}
                className="bg-[color:var(--color-bg-card)] border border-[color:var(--color-text-on-dark)]/10 px-2 py-1 text-[color:var(--color-text-on-dark)]"
              >
                <option value={0.5}>0.5x</option>
                <option value={0.75}>0.75x</option>
                <option value={1}>1x</option>
                <option value={1.25}>1.25x</option>
              </select>

              {/* Language Controls */}
              <div className="flex gap-2">
                <button
                  className={`px-3 py-1 border transition-colors ${
                    showSpanish 
                      ? 'bg-[color:var(--color-accent-secondary)] text-[color:var(--color-text-inverse)] border-[color:var(--color-accent-secondary)]' 
                      : 'bg-transparent border-[color:var(--color-accent-secondary)] text-[color:var(--color-accent-secondary)]'
                  }`}
                  onClick={() => setShowSpanish(!showSpanish)}
                >
                  {showSpanish ? 'Hide Spanish' : 'Show Spanish'}
                </button>
                <button
                  className={`px-3 py-1 border transition-colors ${
                    showEnglish 
                      ? 'bg-[color:var(--color-accent-secondary)] text-[color:var(--color-text-inverse)] border-[color:var(--color-accent-secondary)]' 
                      : 'bg-transparent border-[color:var(--color-accent-secondary)] text-[color:var(--color-accent-secondary)]'
                  }`}
                  onClick={() => setShowEnglish(!showEnglish)}
                >
                  {showEnglish ? 'Hide English' : 'Show English'}
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="h-1 bg-[color:var(--color-bg-card)] border border-[color:var(--color-text-on-dark)]/10 mt-2">
              <div 
                className="h-full bg-[color:var(--color-accent-secondary)]" 
                style={{ 
                  width: `${(currentTime / (playerRef.current?.getDuration() || 1)) * 100}%` 
                }}
              />
            </div>
          </div>

          {/* Transcript */}
          <div className="px-4 py-2">
            {sampleTranscript.map((segment, index) => (
              <div 
                key={index}
                className={`p-2 border-b border-[color:var(--color-text-on-dark)]/10 ${
                  currentTime >= segment.startTime && currentTime <= segment.endTime
                    ? 'bg-[color:var(--color-accent-secondary)]/10'
                    : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => playSegment(segment.startTime, segment.endTime)}
                    className="bg-[color:var(--color-accent-secondary)] px-2 py-1 text-[color:var(--color-text-inverse)] shrink-0 text-sm"
                  >
                    {isPlaying && currentTime >= segment.startTime && currentTime <= segment.endTime ? '⏸️' : '▶️'} {formatTime(segment.startTime)}
                  </button>
                  <div className="flex-1">
                    <p className={`text-[color:var(--color-text-on-dark)] text-lg transition-all ${showSpanish ? 'opacity-100 blur-none' : 'opacity-50 blur-sm'}`}>
                      {segment.spanish}
                    </p>
                    <p className={`text-[color:var(--color-text-on-dark)]/80 transition-all ${showEnglish ? 'opacity-100 blur-none' : 'opacity-50 blur-sm'}`}>
                      {segment.english}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}