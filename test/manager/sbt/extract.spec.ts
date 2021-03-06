import { readFileSync } from 'fs';
import { resolve } from 'path';
import { extractPackageFile } from '../../../lib/manager/sbt/extract';

const sbt = readFileSync(resolve(__dirname, `./_fixtures/sample.sbt`), 'utf8');
const sbtScalaVersionVariable = readFileSync(
  resolve(__dirname, `./_fixtures/scala-version-variable.sbt`),
  'utf8'
);
const sbtMissingScalaVersion = readFileSync(
  resolve(__dirname, `./_fixtures/missing-scala-version.sbt`),
  'utf8'
);

const sbtDependencyFile = readFileSync(
  resolve(__dirname, `./_fixtures/dependency-file.scala`),
  'utf8'
);

describe('lib/manager/sbt/extract', () => {
  describe('extractPackageFile()', () => {
    it('returns null for empty', () => {
      expect(extractPackageFile(null)).toBeNull();
      expect(extractPackageFile('non-sense')).toBeNull();
      expect(
        extractPackageFile('libraryDependencies += "foo" % "bar" % ???')
      ).toBeNull();
      expect(
        extractPackageFile('libraryDependencies += "foo" % "bar" %% "baz"')
      ).toBeNull();
      expect(
        extractPackageFile('libraryDependencies += ??? % "bar" % "baz"')
      ).toBeNull();
      expect(
        extractPackageFile('libraryDependencies += "foo" % ??? % "baz"')
      ).toBeNull();

      expect(extractPackageFile('libraryDependencies += ')).toBeNull();
      expect(extractPackageFile('libraryDependencies += "foo"')).toBeNull();
      expect(
        extractPackageFile('libraryDependencies += "foo" % "bar" %')
      ).toBeNull();
      expect(
        extractPackageFile('libraryDependencies += "foo" % "bar" % "baz" %%')
      ).toBeNull();
    });
    it('extracts deps for generic use-cases', () => {
      expect(extractPackageFile(sbt)).toMatchSnapshot();
    });
    it('extracts deps when scala version is defined in a variable', () => {
      expect(extractPackageFile(sbtScalaVersionVariable)).toMatchSnapshot();
    });
    it('skips deps when scala version is missing', () => {
      expect(extractPackageFile(sbtMissingScalaVersion)).toMatchSnapshot();
    });
    it('extract deps from native scala file with variables', () => {
      expect(extractPackageFile(sbtDependencyFile)).toMatchSnapshot();
    });
  });
});
