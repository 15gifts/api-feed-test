use strict;
use warnings;

use Cpanel::JSON::XS;
use HTTP::Request;
use LWP::UserAgent;

my $min_abv = $ARGV[0];
my $max_abv = $ARGV[1];

my $url = 'https://api.punkapi.com/v2/beers';
my $ua  = LWP::UserAgent->new;

my $json_coder = Cpanel::JSON::XS->new;

my $req = HTTP::Request->new(
    GET => $url . "?abv_gt=$min_abv&abv_lt=$max_abv",
    [ 'User-Agent' => 'curl/7.68.0' ],
);

my $resp = $ua->request($req);
if ( $resp->is_success ) {
    my $decoded = $json_coder->decode( $resp->decoded_content );

    for my $beer (@$decoded) {
        my $name      = $beer->{name}      // '';
        my $image_url = $beer->{image_url} // '';
        my $desc      = $beer->{desc}      // '';
        my $tag       = $beer->{tag}       // '';

        print "Name: $name\n";
        print "Image URL: $image_url\n";
        print "Description: $desc\n";
        print "Tagline: $tag\n";

        my $hop_names = join ', ',
            map { $_->{name} } @{ $beer->{ingredients}{hops} };
        print "Hops: $hop_names\n";

        my $malt_names = join ', ',
            map { $_->{name} } @{ $beer->{ingredients}{malt} };
        print "Malt: $malt_names\n";

        print "\n";
    }
}
else {
    die 'Failure: ' . $resp->decoded_content;
}
