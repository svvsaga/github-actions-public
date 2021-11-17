import { arch, platform } from 'os'

export function getPlatformAndArch(): { platform: string; arch: string } {
  // arch in [arm, x32, x64...] (https://nodejs.org/api/os.html#os_os_arch)
  // return value in [amd64, 386, arm]
  function mapArch(osArch: string): string {
    const mappings: Record<string, string> = {
      x32: '386',
      x64: 'amd64',
    }
    return mappings[osArch] || osArch
  }

  // platform in [darwin, linux, win32...] (https://nodejs.org/api/os.html#os_os_platform)
  // return value in [darwin, linux, windows]
  function mapPlatform(osPlatform: string): string {
    const mappings: Record<string, string> = {
      win32: 'windows',
    }
    return mappings[osPlatform] || osPlatform
  }

  const osPlatform = platform()
  const osArch = arch()

  return { platform: mapPlatform(osPlatform), arch: mapArch(osArch) }
}
