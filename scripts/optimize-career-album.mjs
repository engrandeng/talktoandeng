import { execFile } from 'node:child_process'
import { mkdtemp, mkdir, readdir, rm } from 'node:fs/promises'
import { promisify } from 'node:util'
import os from 'node:os'
import path from 'node:path'
import sharp from 'sharp'

const execFileAsync = promisify(execFile)
const sourceDirectory = path.resolve('src/assets/career-album')
const outputDirectory = path.join(sourceDirectory, 'optimized')
const supportedImage = /\.(avif|gif|heic|heif|jpe?g|png|webp)$/i
const heicImage = /\.(heic|heif)$/i

await rm(outputDirectory, { recursive: true, force: true })
await mkdir(outputDirectory, { recursive: true })

const files = await readdir(sourceDirectory, { withFileTypes: true })
const images = files.filter((file) => file.isFile() && supportedImage.test(file.name))

for (const image of images) {
  const input = path.join(sourceDirectory, image.name)
  const output = path.join(outputDirectory, `${path.parse(image.name).name}.webp`)
  let temporaryDirectory

  try {
    let processableInput = input

    // sharp's HEIC decoder rejects some valid iPhone files. Convert those with
    // macOS ImageIO first, then use sharp to strip metadata and emit WebP.
    if (heicImage.test(image.name)) {
      temporaryDirectory = await mkdtemp(path.join(os.tmpdir(), 'career-album-'))
      processableInput = path.join(temporaryDirectory, `${path.parse(image.name).name}.jpg`)
      await execFileAsync('sips', ['-s', 'format', 'jpeg', input, '--out', processableInput])
    }

    await sharp(processableInput)
      .rotate()
      .resize({ width: 1400, height: 1400, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 78, effort: 5 })
      .toFile(output)
    console.log(`Optimized ${image.name}`)
  } catch (error) {
    console.warn(`Skipped ${image.name}: ${error.message}`)
  } finally {
    if (temporaryDirectory) {
      await rm(temporaryDirectory, { recursive: true, force: true })
    }
  }
}
